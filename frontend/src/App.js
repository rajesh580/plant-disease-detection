import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Progress } from './components/ui/progress';
import { Alert, AlertDescription } from './components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Upload, Camera, Leaf, AlertCircle, CheckCircle, TrendingUp, Shield, Zap } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Hero section with gradient background
  const HeroSection = () => (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23059669' stroke-width='1'%3E%3Cpath d='M20 20l10-10M20 20l-10-10M20 20l10 10M20 20l-10 10'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-6 py-2 rounded-full text-sm font-medium mb-8">
            <Leaf className="w-4 h-4 mr-2" />
            AI-Powered Plant Health Detection
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-800 via-teal-700 to-green-600 bg-clip-text text-transparent mb-6 leading-tight">
            Detect Plant Diseases
            <br />
            <span className="text-emerald-900">Instantly with AI</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Upload a photo of your plant and get instant AI-powered diagnosis with detailed treatment recommendations and prevention tips
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/80 backdrop-blur border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <Zap className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-emerald-900">Instant Analysis</h3>
                <p className="text-gray-600">Get results in seconds using advanced AI vision technology</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-emerald-900">Detailed Insights</h3>
                <p className="text-gray-600">Comprehensive analysis with severity assessment and symptoms</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-emerald-900">Treatment Plans</h3>
                <p className="text-gray-600">Actionable treatment and prevention recommendations</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => document.getElementById('analyzer-section').scrollIntoView({ behavior: 'smooth' })}
              data-testid="get-started-button"
            >
              <Leaf className="w-5 h-5 mr-2" />
              Start Plant Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // File upload handler
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully!');
    }
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      toast.success('Camera activated!');
    } catch (error) {
      toast.error('Camera access denied or not available');
      console.error('Camera error:', error);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  }, [cameraStream]);

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      setIsCapturing(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setSelectedImage(file);
        setImagePreview(canvas.toDataURL());
        stopCamera();
        setIsCapturing(false);
        toast.success('Photo captured successfully!');
      }, 'image/jpeg');
    }
  }, [stopCamera]);

  // Analyze plant image
  const analyzeImage = useCallback(async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await fetch(`${API}/analyze-upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.analysis) {
        setAnalysisResult(result.analysis);
        toast.success('Analysis completed successfully!');
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
    } catch (error) {
      toast.error(`Analysis failed: ${error.message}`);
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedImage]);

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Analysis Section */}
      <section id="analyzer-section" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Plant Health Analyzer</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload an image or use your camera to get instant plant disease detection and treatment recommendations
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Image Upload Section */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center">
                    <Camera className="w-6 h-6 mr-2 text-emerald-600" />
                    Upload Plant Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload" data-testid="upload-tab">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                      </TabsTrigger>
                      <TabsTrigger value="camera" data-testid="camera-tab">
                        <Camera className="w-4 h-4 mr-2" />
                        Use Camera
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="space-y-4">
                      <div 
                        className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300"
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="file-upload-area"
                      >
                        <Upload className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                        <p className="text-lg text-gray-700 mb-2">Click to upload an image</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        data-testid="file-input"
                      />
                    </TabsContent>
                    
                    <TabsContent value="camera" className="space-y-4">
                      {!showCamera ? (
                        <Button 
                          onClick={startCamera} 
                          className="w-full bg-emerald-600 hover:bg-emerald-700 py-6"
                          data-testid="start-camera-button"
                        >
                          <Camera className="w-5 h-5 mr-2" />
                          Start Camera
                        </Button>
                      ) : (
                        <div className="space-y-4">
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full rounded-lg"
                            data-testid="camera-video"
                          />
                          <div className="flex gap-4">
                            <Button 
                              onClick={capturePhoto} 
                              disabled={isCapturing}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                              data-testid="capture-photo-button"
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              {isCapturing ? 'Capturing...' : 'Capture Photo'}
                            </Button>
                            <Button 
                              onClick={stopCamera} 
                              variant="outline"
                              data-testid="stop-camera-button"
                            >
                              Stop
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  {imagePreview && (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full rounded-lg shadow-lg max-h-64 object-cover"
                        data-testid="image-preview"
                      />
                      <Button 
                        onClick={analyzeImage} 
                        disabled={isAnalyzing}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg"
                        data-testid="analyze-button"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Analyzing Plant...
                          </>
                        ) : (
                          <>
                            <Leaf className="w-5 h-5 mr-2" />
                            Analyze Plant Health
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-emerald-600" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!analysisResult ? (
                    <div className="text-center py-12" data-testid="no-results-message">
                      <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Upload an image to see analysis results</p>
                    </div>
                  ) : (
                    <div className="space-y-6" data-testid="analysis-results">
                      {/* Disease Info */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-900" data-testid="disease-name">
                            {analysisResult.disease_name}
                          </h3>
                          <Badge className={getSeverityColor(analysisResult.severity)} data-testid="severity-badge">
                            {analysisResult.severity}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Confidence Level</p>
                            <div className="flex items-center space-x-3">
                              <Progress 
                                value={analysisResult.confidence * 100} 
                                className="flex-1" 
                                data-testid="confidence-progress"
                              />
                              <span className={`font-semibold ${getConfidenceColor(analysisResult.confidence)}`}>
                                {Math.round(analysisResult.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Symptoms */}
                      {analysisResult.symptoms && analysisResult.symptoms.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2 text-amber-600" />
                            Symptoms Detected
                          </h4>
                          <div className="space-y-2" data-testid="symptoms-list">
                            {analysisResult.symptoms.map((symptom, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-gray-700">{symptom}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Separator />

                      {/* Treatment */}
                      {analysisResult.treatment && analysisResult.treatment.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            Treatment Recommendations
                          </h4>
                          <div className="space-y-2" data-testid="treatment-list">
                            {analysisResult.treatment.map((treatment, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-gray-700">{treatment}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Separator />

                      {/* Prevention */}
                      {analysisResult.prevention && analysisResult.prevention.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-blue-600" />
                            Prevention Tips
                          </h4>
                          <div className="space-y-2" data-testid="prevention-list">
                            {analysisResult.prevention.map((tip, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-gray-700">{tip}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden canvas for camera capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default App;