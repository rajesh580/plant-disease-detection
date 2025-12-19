import React, { useState, useRef, useCallback, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Progress } from './components/ui/progress';
import { Alert, AlertDescription } from './components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Upload, Camera, Leaf, AlertCircle, CheckCircle, TrendingUp, Shield, Zap, Volume2, VolumeX } from 'lucide-react';
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
  const [cameraError, setCameraError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translatedResult, setTranslatedResult] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingSpeech, setIsLoadingSpeech] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const utteranceRef = useRef(null);
  const ttsControllerRef = useRef(null);  // AbortController for TTS requests

  // Language options
  const LANGUAGES = {
    en: 'English',
    hi: 'हिन्दी (Hindi)',
    kn: 'ಕನ್ನಡ (Kannada)',
    ta: 'தமிழ் (Tamil)',
    te: 'తెలుగు (Telugu)',
    mr: 'मराठी (Marathi)',
    gu: 'ગુજરાતી (Gujarati)',
  };

  // Heading translations
  const HEADING_TRANSLATIONS = {
    'Symptoms Detected': {
      en: 'Symptoms Detected',
      hi: 'लक्षण',
      kn: 'ಗುರುತಿಸಿದ ಲಕ್ಷಣಗಳು',
      ta: 'கண்டறிந்த அறிகுறிகள்',
      te: 'గుర్తించిన లక్షణాలు',
      mr: 'लक्षण',
      gu: 'શોધાયેલ લક્ષણો'
    },
    'Treatment Recommendations': {
      en: 'Treatment Recommendations',
      hi: 'उपचार',
      kn: 'ಚಿಕಿತ್ಸೆ ಶಿಫಾರಸುಗಳು',
      ta: 'சிகிச்சை பரிந்துரைகள்',
      te: 'చికిత్స సిఫారసులు',
      mr: 'उपचार',
      gu: 'ઉપચાર ભલામણો'
    },
    'Prevention Tips': {
      en: 'Prevention Tips',
      hi: 'रोकथाम',
      kn: 'ತಡೆಗಟ್ಟುವ ಸಲಹೆಗಳು',
      ta: 'தடுப்பு ஆலோசனைகள்',
      te: 'నివారణ చిట్కాలు',
      mr: 'रोकथाम',
      gu: 'નિવારણ ટિપ્સ'
    },
    'Confidence Level': {
      en: 'Confidence Level',
      hi: 'आत्मविश्वास स्तर',
      kn: 'ವಿಶ್ವಾಸದ ಮಟ್ಟ',
      ta: 'நம்பிக்கை நிலை',
      te: 'విశ్వాస స్థితి',
      mr: 'आत्मविश्वास स्तर',
      gu: 'આત્મવિશ્વાસ સ્તર'
    }
  };

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
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Camera API not supported in this browser');
        console.error('Camera API not supported:', navigator.mediaDevices);
        return;
      }
      
      // Request permission and get stream
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      console.log('Stream obtained:', stream);
      
      // Update state to show camera (this renders the video element)
      setShowCamera(true);
      setCameraStream(stream);
      setCameraError(null);
      
      // Wait a tick for React to render the video element
      setTimeout(async () => {
        // Try to get video element from ref OR by ID (fallback)
        const videoElement = videoRef.current || document.getElementById('camera-video-element');
        console.log('Video element lookup:', { refExists: !!videoRef.current, idExists: !!document.getElementById('camera-video-element'), final: !!videoElement });
        
        if (!videoElement) {
          console.error('Video element not found via ref or ID!');
          setCameraError('Video element not found in DOM');
          toast.error('Video element not found in DOM');
          return;
        }
        
        try {
          console.log('Attaching stream to video element...');
          videoElement.srcObject = stream;
          console.log('Stream attached. Video element now has srcObject:', !!videoElement.srcObject);
          
          // Wait a bit for metadata to load, then force play
          const maxAttempts = 5;
          let attempts = 0;
          
          const tryPlay = async () => {
            attempts++;
            console.log(`Play attempt ${attempts}/${maxAttempts}`);
            
            if (videoElement?.videoWidth > 0) {
              console.log('Video metadata loaded:', { width: videoElement.videoWidth, height: videoElement.videoHeight });
              try {
                await videoElement.play();
                console.log('Video play() succeeded!');
                toast.success('Video playing!');
              } catch (playErr) {
                console.warn('Play attempt failed:', playErr.name, playErr.message);
                if (attempts < maxAttempts) {
                  setTimeout(tryPlay, 200);
                } else {
                  setCameraError(`Play failed after ${maxAttempts} attempts: ${playErr.message}`);
                  toast.error(`Play failed: ${playErr.message}`);
                }
              }
            } else if (attempts < maxAttempts) {
              console.log('Metadata not ready, retrying...');
              setTimeout(tryPlay, 200);
            } else {
              setCameraError('Video metadata failed to load');
              toast.error('Video metadata failed to load');
            }
          };
          
          setTimeout(tryPlay, 100);
          
        } catch (assignErr) {
          console.error('Failed to assign stream to video element:', assignErr);
          setCameraError(`Assign error: ${assignErr.message}`);
          toast.error(`Assignment failed: ${assignErr.message}`);
        }
      }, 50);
      
      toast.success('Camera activated!');
    } catch (error) {
      const errName = error?.name || 'CameraError';
      const errMsg = error?.message || '';
      setCameraError(`${errName}: ${errMsg}`);
      toast.error(`${errName}: ${errMsg}`);
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
    setCameraError(null);
  }, [cameraStream]);

  // Stop any ongoing speech
  const stopSpeech = useCallback(() => {
    // Abort any pending TTS request
    if (ttsControllerRef.current) {
      ttsControllerRef.current.abort();
      ttsControllerRef.current = null;
    }

    if (utteranceRef.current) {
      if (utteranceRef.current instanceof Audio) {
        utteranceRef.current.pause();
        utteranceRef.current.currentTime = 0;
      } else {
        window.speechSynthesis.cancel();
      }
    }
    setIsSpeaking(false);
    setIsLoadingSpeech(false);
  }, []);

  // Translate analysis results
  const translateResults = useCallback(async (targetLanguage) => {
    // Stop any ongoing speech when language changes
    stopSpeech();

    if (!analysisResult || targetLanguage === 'en') {
      setTranslatedResult(null);
      setSelectedLanguage(targetLanguage);
      return;
    }

    setIsTranslating(true);
    try {
      console.log(`[Translation] Starting translation to ${targetLanguage}`);
      
      // Translate each field separately to ensure consistency
      const disease_name = await translateText(analysisResult.disease_name, targetLanguage);
      const severity = await translateText(analysisResult.severity, targetLanguage);
      
      // Translate symptoms array - sequential to prevent mixing
      const symptoms = [];
      for (const s of (analysisResult.symptoms || [])) {
        const translated = await translateText(s, targetLanguage);
        symptoms.push(translated);
      }
      
      // Translate treatment array - sequential to prevent mixing
      const treatment = [];
      for (const t of (analysisResult.treatment || [])) {
        const translated = await translateText(t, targetLanguage);
        treatment.push(translated);
      }
      
      // Translate prevention array - sequential to prevent mixing
      const prevention = [];
      for (const p of (analysisResult.prevention || [])) {
        const translated = await translateText(p, targetLanguage);
        prevention.push(translated);
      }

      const translated = {
        disease_name,
        severity,
        symptoms,
        treatment,
        prevention,
        confidence: analysisResult.confidence
      };

      console.log(`[Translation] Completed for ${targetLanguage}:`, translated);
      
      setTranslatedResult(translated);
      setSelectedLanguage(targetLanguage);
      toast.success(`Translated to ${LANGUAGES[targetLanguage]}`);
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. Showing original text.');
      setTranslatedResult(null);
    } finally {
      setIsTranslating(false);
    }
  }, [analysisResult, stopSpeech]);

  // Helper function to translate text with better error handling
  const translateText = async (text, targetLanguage) => {
    try {
      // Skip translation for very short text or empty
      if (!text || text.trim().length === 0) {
        return text;
      }

      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}&cb=${Date.now()}`,
        { cache: 'no-store' }
      );
      
      if (!response.ok) {
        return text;
      }
      
      const data = await response.json();
      
      // Get translated text
      let translatedText = data.responseData?.translatedText || text;
      
      // Validate translation quality
      if (!translatedText || translatedText.trim().length === 0) {
        return text;
      }
      
      // Remove any HTML entities that might have been added
      translatedText = translatedText
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .trim();
      
      return translatedText;
    } catch (error) {
      console.warn('Translation error for:', text, error);
      return text;
    }
  };

  // Text-to-speech function
  const speakAnalysisResult = useCallback(async () => {
    if (!analysisResult) {
      toast.error('No analysis results to speak');
      return;
    }

    // If already speaking, stop it
    if (isSpeaking) {
      if (utteranceRef.current) {
        if (utteranceRef.current instanceof Audio) {
          utteranceRef.current.pause();
          utteranceRef.current.currentTime = 0;
        } else {
          window.speechSynthesis.cancel();
        }
      }
      setIsSpeaking(false);
      return;
    }

    try {
      setIsLoadingSpeech(true);
      
      // Use translated result if available and not English, otherwise use original
      const resultToSpeak = (selectedLanguage !== 'en' && translatedResult) 
        ? translatedResult 
        : analysisResult;
      
      // Get translated headings
      const getHeading = (key) => HEADING_TRANSLATIONS[key]?.[selectedLanguage] || HEADING_TRANSLATIONS[key]?.['en'] || key;
      
      // Build the text to speak with translated headings (optimized for speed)
      const textToSpeak = `${resultToSpeak.disease_name}. ${getHeading('Confidence Level')}: ${Math.round(resultToSpeak.confidence * 100)}%. ${getHeading('Symptoms Detected')}: ${resultToSpeak.symptoms?.join(', ') || 'None'}. ${getHeading('Treatment Recommendations')}: ${resultToSpeak.treatment?.join(', ') || 'None'}. ${getHeading('Prevention Tips')}: ${resultToSpeak.prevention?.join(', ') || 'None'}.`;

      // Language code mapping
      const languageMap = {
        en: 'en-US',
        hi: 'hi-IN',
        kn: 'kn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
      };
      
      // For non-English languages, use backend TTS (with caching)
      if (selectedLanguage !== 'en') {
        try {
          // Create a new AbortController for this request
          const controller = new AbortController();
          ttsControllerRef.current = controller;
          
          const startTime = performance.now();
          
          // Fetch with timeout
          const fetchPromise = fetch(`${API}/tts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: textToSpeak,
              language: selectedLanguage
            }),
            signal: controller.signal
          });

          const response = await fetchPromise;

          if (!response.ok) {
            throw new Error('TTS service error');
          }

          const generationTime = performance.now() - startTime;
          const isCached = generationTime < 500;
          console.log(`TTS generation took: ${generationTime.toFixed(0)}ms ${isCached ? '(cached)' : '(generated)'}`);

          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          
          // Optimized: Minimal toast notifications
          audio.onplay = () => {
            setIsLoadingSpeech(false);
            setIsSpeaking(true);
          };

          audio.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
            ttsControllerRef.current = null;
          };

          audio.onerror = (e) => {
            setIsSpeaking(false);
            setIsLoadingSpeech(false);
            URL.revokeObjectURL(audioUrl);
            console.error('Audio playback error:', e);
            ttsControllerRef.current = null;
          };

          utteranceRef.current = audio;
          await audio.play();
          return;
        } catch (error) {
          if (error.name === 'AbortError') {
            console.log('TTS request aborted');
            setIsLoadingSpeech(false);
            return;
          }
          console.error('Backend TTS error:', error);
          // Fall through to browser speech synthesis
        }
      }

      // Use browser Speech Synthesis for English or as fallback
      const synth = window.speechSynthesis;
      
      // Cancel any previous speech
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      utterance.lang = languageMap[selectedLanguage] || 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsLoadingSpeech(false);
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        setIsLoadingSpeech(false);
        console.error(`Speech error: ${event.error}`);
      };

      utteranceRef.current = utterance;
      
      // Wait for voices to be loaded
      const attemptSpeak = () => {
        const voices = synth.getVoices();
        
        if (voices.length > 0) {
          // Try to find a voice for the selected language
          const targetLang = languageMap[selectedLanguage];
          const matchingVoice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
          
          if (matchingVoice) {
            utterance.voice = matchingVoice;
          }
          
          synth.speak(utterance);
        } else {
          // Voices not loaded yet, retry
          setTimeout(attemptSpeak, 100);
        }
      };
      
      attemptSpeak();
    } catch (error) {
      setIsSpeaking(false);
      setIsLoadingSpeech(false);
      toast.error(`Speech error: ${error.message}`);
      console.error('Speech error:', error);
    }
  }, [analysisResult, translatedResult, selectedLanguage, isSpeaking, LANGUAGES, API]);

  // Wrapper function to handle speak with translation
  const handleSpeak = useCallback(() => {
    // If user selected a language other than English and no translation exists, translate first
    if (selectedLanguage !== 'en' && !translatedResult && !isTranslating) {
      toast.info(`Translating to ${LANGUAGES[selectedLanguage]}...`);
      // Translate and speak will be triggered when translatedResult updates (via effect)
      translateResults(selectedLanguage);
    } else {
      speakAnalysisResult();
    }
  }, [selectedLanguage, translatedResult, isTranslating, LANGUAGES, translateResults, speakAnalysisResult]);

  // NOTE: removed automatic speaking when the language changes.
  // Speech will now only start when the user explicitly clicks the Speak button.

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      setIsCapturing(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Check if video is ready
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        toast.error('Video not ready. Wait a moment and try again.');
        setIsCapturing(false);
        console.warn('Video dimensions are 0:', { videoWidth: video.videoWidth, videoHeight: video.videoHeight });
        return;
      }
      
      console.log('Capturing from video:', { videoWidth: video.videoWidth, videoHeight: video.videoHeight });
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      // Ensure we got valid canvas data
      const canvasDataUrl = canvas.toDataURL();
      if (!canvasDataUrl || canvasDataUrl.length < 100) {
        toast.error('Canvas capture failed. Camera may not be working.');
        setIsCapturing(false);
        console.error('Invalid canvas data:', canvasDataUrl.length);
        return;
      }
      
      canvas.toBlob((blob) => {
        if (!blob || blob.size === 0) {
          toast.error('Canvas blob is empty. Camera may not be working.');
          setIsCapturing(false);
          console.error('Canvas blob is empty or null');
          return;
        }
        
        console.log('Blob captured:', { size: blob.size, type: blob.type });
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setSelectedImage(file);
        setImagePreview(canvasDataUrl);
        stopCamera();
        setIsCapturing(false);
        toast.success('Photo captured successfully!');
      }, 'image/jpeg', 0.95);
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
                          <div className="bg-gray-900 rounded-lg overflow-hidden">
                            <video 
                              id="camera-video-element"
                              ref={videoRef} 
                              autoPlay 
                              muted
                              playsInline 
                              className="w-full rounded-lg bg-black"
                              style={{ display: 'block' }}
                              data-testid="camera-video"
                              onLoadedMetadata={() => {
                                console.log('Video metadata loaded:', { width: videoRef.current?.videoWidth, height: videoRef.current?.videoHeight });
                                if (videoRef.current) {
                                  videoRef.current.play().catch(e => console.warn('Play on metadata failed:', e));
                                }
                              }}
                              onCanPlay={() => console.log('Video can play')}
                              onPlay={() => console.log('Video playing')}
                            />
                          </div>
                          {cameraError && (
                            <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded" data-testid="camera-error">
                              <strong>Error:</strong> {cameraError}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded">
                            <div>Stream: {cameraStream ? '✓ Active' : '✗ None'}</div>
                            <div>Video: {videoRef.current?.srcObject ? '✓ Attached' : '✗ No source'}</div>
                            <div>Playing: {videoRef.current && !videoRef.current.paused ? '✓ Yes' : '✗ Paused'}</div>
                            <div>Resolution: {videoRef.current?.videoWidth}x{videoRef.current?.videoHeight}</div>
                          </div>
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                const v = videoRef.current;
                                const info = {
                                  exists: !!v,
                                  paused: v?.paused,
                                  readyState: v?.readyState,
                                  videoWidth: v?.videoWidth,
                                  videoHeight: v?.videoHeight,
                                  srcObject: !!v?.srcObject,
                                  tracks: v?.srcObject?.getTracks?.().map(t => ({kind: t.kind, readyState: t.readyState})) || []
                                };
                                console.log('Video element state:', info);
                                toast.info(`Video state: paused=${v?.paused}, res=${v?.videoWidth}x${v?.videoHeight}`);
                              }}
                              className="text-xs text-blue-600 underline"
                            >
                              Log video state to console
                            </button>
                          </div>
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
                              onClick={() => {
                                if (videoRef.current) {
                                  videoRef.current.play().then(() => console.log('Manual play succeeded')).catch(e => console.error('Manual play failed:', e));
                                }
                              }} 
                              variant="outline"
                              className="flex-1"
                            >
                              Force Play
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
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-2xl text-gray-900 flex items-center">
                      <TrendingUp className="w-6 h-6 mr-2 text-emerald-600" />
                      Analysis Results
                    </CardTitle>
                    {analysisResult && (
                      <div className="flex items-center gap-3">
                        <select 
                          value={selectedLanguage}
                          onChange={(e) => translateResults(e.target.value)}
                          disabled={isTranslating}
                          className="language-select px-4 py-2 border-2 border-emerald-300 rounded-lg text-sm bg-white hover:bg-emerald-50 hover:border-emerald-400 disabled:opacity-50 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {Object.entries(LANGUAGES).map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                          ))}
                        </select>
                        {isLoadingSpeech || isSpeaking ? (
                          <Button
                            onClick={stopSpeech}
                            variant="default"
                            className="speech-button px-3 py-2 bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                            title="Stop"
                          >
                            {isLoadingSpeech ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              </>
                            ) : (
                              <>
                                <VolumeX className="w-4 h-4" />
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSpeak}
                            disabled={isTranslating || !analysisResult}
                            variant="outline"
                            className="speech-button px-3 py-2 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-200"
                            title="Speak analysis results"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
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
                            {translatedResult ? translatedResult.disease_name : analysisResult.disease_name}
                          </h3>
                          <Badge className={getSeverityColor(translatedResult ? translatedResult.severity : analysisResult.severity)} data-testid="severity-badge">
                            {translatedResult ? translatedResult.severity : analysisResult.severity}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {HEADING_TRANSLATIONS['Confidence Level']?.[selectedLanguage] || HEADING_TRANSLATIONS['Confidence Level']?.['en']}
                            </p>
                            <div className="flex items-center space-x-3">
                              <Progress 
                                value={(translatedResult?.confidence || analysisResult.confidence) * 100} 
                                className="flex-1" 
                                data-testid="confidence-progress"
                              />
                              <span className={`font-semibold ${getConfidenceColor(translatedResult?.confidence || analysisResult.confidence)}`}>
                                {Math.round((translatedResult?.confidence || analysisResult.confidence) * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Symptoms */}
                      {(translatedResult?.symptoms || analysisResult.symptoms)?.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2 text-amber-600" />
                            {HEADING_TRANSLATIONS['Symptoms Detected']?.[selectedLanguage] || HEADING_TRANSLATIONS['Symptoms Detected']?.['en']}
                          </h4>
                          <div className="space-y-2" data-testid="symptoms-list">
                            {(translatedResult?.symptoms || analysisResult.symptoms).map((symptom, index) => (
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
                      {(translatedResult?.treatment || analysisResult.treatment)?.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            {HEADING_TRANSLATIONS['Treatment Recommendations']?.[selectedLanguage] || HEADING_TRANSLATIONS['Treatment Recommendations']?.['en']}
                          </h4>
                          <div className="space-y-2" data-testid="treatment-list">
                            {(translatedResult?.treatment || analysisResult.treatment).map((treatment, index) => (
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
                      {(translatedResult?.prevention || analysisResult.prevention)?.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-blue-600" />
                            {HEADING_TRANSLATIONS['Prevention Tips']?.[selectedLanguage] || HEADING_TRANSLATIONS['Prevention Tips']?.['en']}
                          </h4>
                          <div className="space-y-2" data-testid="prevention-list">
                            {(translatedResult?.prevention || analysisResult.prevention).map((tip, index) => (
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