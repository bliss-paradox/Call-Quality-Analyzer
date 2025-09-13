"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Users,
  MessageCircle,
  BarChart3,
  Download,
  Play,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface AnalysisResult {
  talkTimeRatio: number;
  questionsCount: number;
  longestMonologue: number;
  sentiment: "positive" | "neutral" | "negative";
  insights: string[];
  transcript: string;
}

export default function SalesCallAnalyzer() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (input: string) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(input);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null); 

    if (!validateUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);

    // Simulated API response (mock data)
    setTimeout(() => {
      setResult({
        talkTimeRatio: 65,
        questionsCount: 12,
        longestMonologue: 42,
        sentiment: "positive",
        insights: [
          "Customer showed strong interest in pricing options",
          "Sales rep effectively addressed objections",
          "Good use of open-ended questions in the first half",
          "Consider reducing monologue length to increase engagement",
        ],
        transcript:
          "Sales Rep: Hello, thank you for calling. How can I help you today?\nCustomer: Hi, I'm interested in your premium package...\n[Full transcript would be here]",
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleDownload = (type: "json" | "transcript") => {
    if (!result) return;

    const data =
      type === "json" ? JSON.stringify(result, null, 2) : result.transcript;

    const blob = new Blob([data], {
      type: type === "json" ? "application/json" : "text/plain",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `sales-analysis.${type === "json" ? "json" : "txt"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  const getSentimentColor = (sentiment: AnalysisResult['sentiment']) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      case "neutral":
      default:
        return "text-yellow-600";
    }
  };

  const getSentimentIcon = (sentiment: AnalysisResult['sentiment']) => {
    switch (sentiment) {
      case "positive":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "negative":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "neutral":
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Sales Call Analyzer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Analyze YouTube sales calls to get insights on talk-time ratio,
            questions asked, sentiment, and actionable recommendations.
          </p>
        </header>

        {/* Input Form */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-600" />
              Analyze Sales Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube Video URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="py-6"
                  aria-label="YouTube Video URL"
                  // CORRECTION 1: Suppress hydration warning from browser extensions
                  suppressHydrationWarning={true}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg"
                disabled={isLoading || !url}
              >
                {isLoading ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Analyzing...
                  </motion.span>
                ) : (
                  "Analyze Sales Call"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Analysis Results
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload("json")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload("transcript")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Transcript
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Talk-Time Ratio</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">
                      {result.talkTimeRatio}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Sales rep talking time
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Questions Asked</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {result.questionsCount}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      By sales representative
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Longest Monologue</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">
                      {result.longestMonologue}s
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Continuous talking time
                    </p>
                  </div>
                </div>

                {/* Sentiment */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(result.sentiment)}
                    <span className="font-medium">Overall Sentiment</span>
                    <span
                      className={`ml-2 font-semibold ${getSentimentColor(
                        result.sentiment
                      )}`}
                    >
                      {result.sentiment.charAt(0).toUpperCase() +
                        result.sentiment.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Insights */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Actionable Insights
                  </h3>
                  <ul className="space-y-2">
                    {result.insights.map((insight, index) => (
                      // CORRECTION 2: Added the required "key" prop for list rendering
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}