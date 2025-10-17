#!/usr/bin/env python3

import requests
import sys
import json
import base64
import os
from datetime import datetime
from pathlib import Path

class PlantDiseaseAPITester:
    def __init__(self, base_url="https://crophealth-8.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Response: {data}"
            self.log_test("API Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, str(e))
            return False

    def test_status_endpoints(self):
        """Test status check endpoints"""
        try:
            # Test POST status
            test_data = {"client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"}
            response = requests.post(f"{self.api_url}/status", json=test_data, timeout=10)
            
            post_success = response.status_code == 200
            details = f"POST Status: {response.status_code}"
            if post_success:
                data = response.json()
                details += f", Created ID: {data.get('id', 'N/A')}"
            
            self.log_test("POST Status Check", post_success, details)
            
            # Test GET status
            response = requests.get(f"{self.api_url}/status", timeout=10)
            get_success = response.status_code == 200
            details = f"GET Status: {response.status_code}"
            if get_success:
                data = response.json()
                details += f", Records count: {len(data)}"
            
            self.log_test("GET Status Checks", get_success, details)
            
            return post_success and get_success
            
        except Exception as e:
            self.log_test("Status Endpoints", False, str(e))
            return False

    def create_test_image_base64(self):
        """Create a simple test image in base64 format"""
        # Create a simple 100x100 green square PNG
        import io
        try:
            from PIL import Image
            img = Image.new('RGB', (100, 100), color='green')
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            img_data = buffer.getvalue()
            return base64.b64encode(img_data).decode('utf-8')
        except ImportError:
            # Fallback: create a minimal PNG base64 (1x1 green pixel)
            # This is a valid 1x1 green PNG in base64
            return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg=="

    def test_analyze_endpoint(self):
        """Test the analyze endpoint with base64 image"""
        try:
            test_image = self.create_test_image_base64()
            test_data = {"image_base64": test_image}
            
            print("🔍 Testing AI analysis endpoint (this may take 10-15 seconds)...")
            response = requests.post(f"{self.api_url}/analyze", json=test_data, timeout=30)
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                if data.get('success') and data.get('analysis'):
                    analysis = data['analysis']
                    details += f", Disease: {analysis.get('disease_name', 'N/A')}"
                    details += f", Confidence: {analysis.get('confidence', 'N/A')}"
                    details += f", Severity: {analysis.get('severity', 'N/A')}"
                else:
                    success = False
                    details += f", Error: {data.get('message', 'Unknown error')}"
            else:
                try:
                    error_data = response.json()
                    details += f", Error: {error_data}"
                except:
                    details += f", Raw response: {response.text[:200]}"
            
            self.log_test("AI Analysis Endpoint", success, details)
            return success
            
        except Exception as e:
            self.log_test("AI Analysis Endpoint", False, str(e))
            return False

    def test_analyze_upload_endpoint(self):
        """Test the analyze-upload endpoint with file upload"""
        try:
            # Create a test image file
            test_image_data = base64.b64decode(self.create_test_image_base64())
            
            files = {'file': ('test_plant.png', test_image_data, 'image/png')}
            
            print("🔍 Testing file upload analysis endpoint (this may take 10-15 seconds)...")
            response = requests.post(f"{self.api_url}/analyze-upload", files=files, timeout=30)
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                if data.get('success') and data.get('analysis'):
                    analysis = data['analysis']
                    details += f", Disease: {analysis.get('disease_name', 'N/A')}"
                    details += f", Confidence: {analysis.get('confidence', 'N/A')}"
                    details += f", Severity: {analysis.get('severity', 'N/A')}"
                else:
                    success = False
                    details += f", Error: {data.get('message', 'Unknown error')}"
            else:
                try:
                    error_data = response.json()
                    details += f", Error: {error_data}"
                except:
                    details += f", Raw response: {response.text[:200]}"
            
            self.log_test("File Upload Analysis", success, details)
            return success
            
        except Exception as e:
            self.log_test("File Upload Analysis", False, str(e))
            return False

    def test_analyses_endpoint(self):
        """Test the analyses history endpoint"""
        try:
            response = requests.get(f"{self.api_url}/analyses", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Analysis records: {len(data)}"
                if len(data) > 0:
                    latest = data[0]
                    details += f", Latest: {latest.get('disease_name', 'N/A')}"
            
            self.log_test("Get Analyses History", success, details)
            return success
            
        except Exception as e:
            self.log_test("Get Analyses History", False, str(e))
            return False

    def test_invalid_endpoints(self):
        """Test error handling for invalid requests"""
        try:
            # Test invalid file type
            files = {'file': ('test.txt', b'not an image', 'text/plain')}
            response = requests.post(f"{self.api_url}/analyze-upload", files=files, timeout=10)
            
            success = response.status_code == 400
            details = f"Invalid file type test - Status: {response.status_code}"
            
            self.log_test("Error Handling - Invalid File Type", success, details)
            return success
            
        except Exception as e:
            self.log_test("Error Handling", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Plant Disease Detection API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test basic connectivity
        if not self.test_api_root():
            print("❌ API root endpoint failed - stopping tests")
            return False
        
        # Test status endpoints
        self.test_status_endpoints()
        
        # Test AI analysis endpoints (these are the core features)
        ai_success = False
        if self.test_analyze_endpoint():
            ai_success = True
        
        if self.test_analyze_upload_endpoint():
            ai_success = True
        
        # Test analyses history
        self.test_analyses_endpoint()
        
        # Test error handling
        self.test_invalid_endpoints()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if not ai_success:
            print("⚠️  CRITICAL: AI analysis endpoints are not working!")
            print("   This is the core functionality of the plant disease detection system.")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        return success_rate >= 70  # Consider successful if 70% or more tests pass

def main():
    """Main test execution"""
    tester = PlantDiseaseAPITester()
    
    try:
        success = tester.run_all_tests()
        
        # Save test results
        results = {
            "timestamp": datetime.now().isoformat(),
            "base_url": tester.base_url,
            "tests_run": tester.tests_run,
            "tests_passed": tester.tests_passed,
            "success_rate": (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0,
            "test_results": tester.test_results
        }
        
        with open('/app/backend_test_results.json', 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
        
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())