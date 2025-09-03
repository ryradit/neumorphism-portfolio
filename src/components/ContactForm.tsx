'use client';

import { useState } from 'react';
import { NeuButton } from './NeuButton';
import { EmailService } from '@/utils/EmailService';

interface ContactFormProps {
  isDark: boolean;
}

export function ContactForm({ isDark }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | '';
    message: string;
  }>({
    type: '',
    message: '',
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      message: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
        valid = false;
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setSubmitStatus({ type: '', message: '' });
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // First try to send with EmailJS directly from the client
      try {
        await EmailService.sendEmail(formData);
      } catch (emailError) {
        // Fallback to our API route if direct EmailJS fails
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send message');
        }
      }

      // Success! Clear the form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      setSubmitStatus({
        type: 'success',
        message: 'Your message has been sent! I\'ll get back to you soon.',
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {submitStatus.type && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}
        >
          {submitStatus.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-heading text-sm font-light">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`neu-input ${isDark ? 'neu-input-dark' : 'neu-input-light'} ${
              errors.name ? 'border border-red-500 dark:border-red-400' : ''
            }`}
            placeholder="Your Name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block mb-2 font-heading text-sm font-light">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`neu-input ${isDark ? 'neu-input-dark' : 'neu-input-light'} ${
              errors.email ? 'border border-red-500 dark:border-red-400' : ''
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block mb-2 font-heading text-sm font-light">Subject</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`neu-input ${isDark ? 'neu-input-dark' : 'neu-input-light'}`}
          placeholder="Message Subject"
        />
      </div>
      
      <div>
        <label className="block mb-2 font-heading text-sm font-light">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`neu-input ${isDark ? 'neu-input-dark' : 'neu-input-light'} min-h-[150px] ${
            errors.message ? 'border border-red-500 dark:border-red-400' : ''
          }`}
          placeholder="Your Message"
        ></textarea>
        {errors.message && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.message}</p>
        )}
      </div>
      
      <NeuButton 
        type="submit" 
        disabled={isSubmitting}
        className={isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </NeuButton>
    </form>
  );
}
