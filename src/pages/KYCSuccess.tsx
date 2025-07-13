import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Shield, ArrowRight, FileCheck, Bell } from 'lucide-react';
import Navbar from '@/components/Navbar';

const KYCSuccess = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    // For customers, redirect to a customer dashboard or appropriate page
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/20 to-background">
      <Navbar />
      <div className="flex justify-center pt-20 pb-8 px-4">
        <div className="max-w-2xl w-full mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center animate-bounce">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-3">
            KYC Submitted Successfully!
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Thank you for providing your details. Your information has been securely submitted for verification.
          </p>
        </div>

        {/* Status Card */}
        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm mb-8">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold flex items-center justify-center gap-2">
              <FileCheck className="h-6 w-6 text-green-600" />
              Verification Status
            </CardTitle>
            <CardDescription>
              Your KYC documents are being processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Steps */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-green-800">Details Submitted</h3>
                  <p className="text-sm text-green-600">Your KYC information has been received</p>
                </div>
                <span className="text-xs text-green-600 font-medium">Completed</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-800">Under Review</h3>
                  <p className="text-sm text-blue-600">Our team is verifying your information</p>
                </div>
                <span className="text-xs text-blue-600 font-medium">In Progress</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-700">Approval Pending</h3>
                  <p className="text-sm text-gray-600">Final verification and account activation</p>
                </div>
                <span className="text-xs text-gray-500 font-medium">Pending</span>
              </div>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Processing Time</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Verification typically takes 2-3 business days
                </p>
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Notifications</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  You'll receive email updates on your verification status
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-green-800">Secure Processing</h4>
                  <p className="text-xs text-green-700">
                    Your data is encrypted and processed in compliance with industry security standards. 
                    We never share your personal information with unauthorized parties.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button
                onClick={handleContinue}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                <span className="flex items-center gap-2">
                  Continue to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="text-center space-y-4">
          <div className="bg-card/30 rounded-lg p-6 border border-border/50">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions about the verification process, our support team is here to help.
            </p>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
          
            <p className="text-xs text-muted-foreground">
              © Zentience - All Rights Reserved. Your data is protected and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCSuccess;