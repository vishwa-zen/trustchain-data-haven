import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, User, Mail, Phone, CreditCard, MapPin, ArrowRight, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { KYCData } from '@/types';
import Navbar from '@/components/Navbar';

const KYCForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<KYCData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    aadhar: '',
    address: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (field: keyof KYCData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "KYC Submitted Successfully",
        description: "Your details have been submitted for verification.",
      });

      navigate('/kyc-success');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your KYC details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-secondary/20 to-background">
      <Navbar />
      <div className="w-full flex justify-center pt-20 pb-8 px-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Know Your Customer</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Please provide your details for identity verification. All information is securely encrypted and stored.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="text-sm font-medium text-foreground">KYC Details</span>
            </div>
            <div className="w-12 h-0.5 bg-border"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm text-muted-foreground">Verification</span>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-base">
              Fill in your details accurately as they appear on your official documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Personal Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Identity Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Identity Verification</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aadhar" className="text-sm font-medium">
                    Aadhar Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="aadhar"
                    placeholder="Enter your 12-digit Aadhar number"
                    value={formData.aadhar}
                    onChange={(e) => handleInputChange('aadhar', e.target.value)}
                    className="h-12"
                    maxLength={12}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Your Aadhar number is encrypted and stored securely
                  </p>
                </div>
              </div>

              <Separator />

              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Address Information</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Complete Address <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete address including city, state, and postal code"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="min-h-[100px] resize-none"
                    required
                  />
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Data Protection</h4>
                    <p className="text-xs text-muted-foreground">
                      Your personal information is protected by enterprise-grade encryption and will only be used for identity verification purposes in compliance with data protection regulations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting KYC Details...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Submit for Verification
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>© Zentience - All Rights Reserved. Your data is protected and secure.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCForm;