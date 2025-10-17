import requests

def test_root():
    response = requests.get('http://127.0.0.1:4000/api/')
    print("Root endpoint:", response.json())

def test_upload_image(image_path):
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post('http://127.0.0.1:4000/api/analyze-upload', files=files)
        print("Analysis response:", response.json())

if __name__ == '__main__':
    # Test root endpoint
    test_root()
    
    # Test image upload (replace with your image path)
    # test_upload_image('path_to_your_image.jpg')