import React, { useState } from 'react';
import { X, Check, ShoppingBag, ShieldCheck, Download, ExternalLink, Star, Sparkles, HelpCircle, ArrowRight, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ebookConfig } from '../config/ebookConfig';
import { PricingEdition } from '../types';
import { spatialAudio } from '../audio/spatialAudio';

import { economicLedger } from '../utils/economicLedger';
import { getDragon9Time } from '../utils/dragon9Time';

interface VaultCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VaultCheckoutModal: React.FC<VaultCheckoutModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedEditionId, setSelectedEditionId] = useState<string>(
    ebookConfig.pricingEditions.find(e => e.isPopular)?.id || ebookConfig.pricingEditions[0].id
  );
  const [isProcessingCheckout, setIsProcessingCheckout] = useState<boolean>(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);
  const [generatedLicense, setGeneratedLicense] = useState<string>('');

  if (!isOpen) return null;

  const selectedEdition: PricingEdition =
    ebookConfig.pricingEditions.find(e => e.id === selectedEditionId) || ebookConfig.pricingEditions[0];

  const handleSimulatedCheckout = () => {
    setIsProcessingCheckout(true);
    spatialAudio.playInteractSound('click');

    setTimeout(() => {
      setIsProcessingCheckout(false);
      setPurchaseSuccess(true);
      
      const d9 = getDragon9Time();
      economicLedger.registerTransaction(
        `Acquisition: ${selectedEdition.name}`,
        selectedEdition.price,
        'debit',
        d9.formatted
      );

      const mockKey = 'FLUID-54-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      setGeneratedLicense(mockKey);
      spatialAudio.playInteractSound('purchase');

      // Trigger Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#8b5cf6', '#f59e0b', '#10b981'],
        });
      } catch {
        // Fallback
      }
    }, 1200);
  };

  const handleDownloadSample = () => {
    spatialAudio.playInteractSound('click');
    const sampleText = `=====================================================
THE FLUID MOTION OF THE FUTURE: SAMPLE EXCERPTS
Author: ${ebookConfig.author}
ISBN: ${ebookConfig.isbn} | Released: ${ebookConfig.releaseYear}
=====================================================

${ebookConfig.salesPitch}

-----------------------------------------------------
CHAPTER 01: THE DRAGON9 FRAMEWORK
-----------------------------------------------------
${ebookConfig.chapters[1]?.pageContent.join('\n\n') || ''}

-----------------------------------------------------
CHAPTER 03: THE LOCALIZATION OF TIMING
-----------------------------------------------------
${ebookConfig.chapters[3]?.pageContent.join('\n\n') || ''}

=====================================================
Unlock the full 284-page master edition at:
${ebookConfig.payhipUrl}
=====================================================`;

    const blob = new Blob([sampleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Fluid_Motion_Future_Sample_Chapters.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-2xl animate-fade-in pointer-events-auto">
      <div
        id="vault-checkout-card"
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-neutral-900 border border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden"
      >
        {/* Top Vault Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Super Puff Node Storefront
                </span>
                <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                  Native Ecosystem Acquisition
                </span>
              </div>
              <h2 className="text-sm font-semibold text-neutral-200">
                {ebookConfig.title}
              </h2>
            </div>
          </div>

          <button
            id="btn-close-vault-modal"
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Storefront Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-neutral-200">
          {purchaseSuccess ? (
            /* Purchase Success State */
            <div className="p-8 rounded-2xl bg-amber-950/30 border border-amber-500/50 text-center space-y-6 animate-fade-in">
              <div className="inline-flex p-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Sparkles className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                  Welcome to Fluid Temporal Mastery!
                </h3>
                <p className="text-neutral-300 font-sans mt-2 max-w-lg mx-auto">
                  Your purchase of <strong className="text-amber-400">{selectedEdition.name}</strong> has been successfully processed.
                </p>
              </div>

              {/* License Box */}
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 max-w-md mx-auto">
                <span className="text-xs font-mono text-neutral-400 block mb-1">
                  Master License Key:
                </span>
                <code className="text-lg font-mono font-bold text-cyan-400 tracking-wider">
                  {generatedLicense}
                </code>
              </div>

              {/* Instant Download Action */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  id="btn-download-purchased-bundle"
                  onClick={handleDownloadSample}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold font-sans shadow-lg transition-transform hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Full Master Package</span>
                </button>
                <button
                  id="btn-done-checkout"
                  onClick={() => setPurchaseSuccess(false)}
                  className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs transition-colors"
                >
                  View Another Edition
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Product Hero Banner */}
              <div className="grid md:grid-cols-3 gap-6 items-center p-6 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950/20 border border-neutral-800">
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                      Master Ebook & Spatial Suite
                    </span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                      <span className="text-xs font-mono ml-1.5 text-neutral-300">5.0 (420+ Reviews)</span>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                    {ebookConfig.title}
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-300 font-sans">
                    {ebookConfig.salesPitch}
                  </p>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2.5 py-1 rounded bg-neutral-950 text-xs font-mono text-neutral-400 border border-neutral-800">
                      📖 {ebookConfig.pageCount} Pages
                    </span>
                    <span className="px-2.5 py-1 rounded bg-neutral-950 text-xs font-mono text-neutral-400 border border-neutral-800">
                      ⚡ {ebookConfig.wordCount}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-neutral-950 text-xs font-mono text-neutral-400 border border-neutral-800">
                      🏷️ ISBN {ebookConfig.isbn}
                    </span>
                  </div>
                </div>

                {/* Free Sample Download Card */}
                <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between h-full space-y-3 text-center sm:text-left">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block font-bold">
                      ✦ Risk-Free Sample
                    </span>
                    <p className="text-xs text-neutral-400 mt-1 font-sans">
                      Read Chapters 1 & 3 with all diagrams and formula sheets.
                    </p>
                  </div>
                  <button
                    id="btn-download-free-sample"
                    onClick={handleDownloadSample}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition-colors border border-neutral-700"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Download Excerpt Sample</span>
                  </button>
                </div>
              </div>

              {/* Pricing Editions Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                    Select Your Edition Package
                  </h3>
                  <span className="text-xs font-mono text-amber-400">
                    30-Day Money Back Guarantee Included
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {ebookConfig.pricingEditions.map((edition) => {
                    const isSelected = selectedEditionId === edition.id;

                    return (
                      <div
                        key={edition.id}
                        id={`pricing-card-${edition.id}`}
                        onClick={() => {
                          setSelectedEditionId(edition.id);
                          spatialAudio.playInteractSound('click');
                        }}
                        className={`relative cursor-pointer flex flex-col justify-between p-5 rounded-2xl transition-all border ${
                          isSelected
                            ? 'bg-neutral-900 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.02]'
                            : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/40'
                        }`}
                      >
                        {/* Popular Badge */}
                        {edition.badge && (
                          <span
                            className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase shadow-md ${
                              edition.isPopular
                                ? 'bg-amber-500 text-neutral-950'
                                : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                            }`}
                          >
                            {edition.badge}
                          </span>
                        )}

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-lg font-bold font-sans text-white">
                              {edition.name}
                            </h4>
                            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                              {edition.description}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold font-sans text-white">
                              {edition.price}
                            </span>
                            {edition.originalPrice && (
                              <span className="text-sm font-sans line-through text-neutral-500">
                                {edition.originalPrice}
                              </span>
                            )}
                            <span className="text-xs font-mono text-neutral-400">NEC</span>
                          </div>

                          {/* Features List */}
                          <div className="space-y-2 border-t border-neutral-800 pt-3">
                            {edition.features.map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Format Includes Footer */}
                        <div className="mt-5 pt-3 border-t border-neutral-800/80">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {edition.formatIncludes.map((fmt, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800"
                              >
                                {fmt}
                              </span>
                            ))}
                          </div>

                          <div
                            className={`w-full py-2 rounded-xl text-center text-xs font-bold font-sans transition-colors ${
                              isSelected
                                ? 'bg-amber-500 text-neutral-950 shadow-md'
                                : 'bg-neutral-800 text-neutral-300 group-hover:bg-neutral-700'
                            }`}
                          >
                            {isSelected ? '✓ Selected' : 'Select Plan'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct Checkout Action Box */}
              <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    Ready for Instant Acquisition: {selectedEdition.name}
                  </span>
                  <div className="text-2xl font-bold text-white">
                    {selectedEdition.price} NEC{' '}
                    <span className="text-sm font-normal text-neutral-400">
                      • Instant Ecosystem Delivery
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  {/* Instant Simulated Checkout (In-App) */}
                  <button
                    id="btn-vault-instant-checkout"
                    onClick={handleSimulatedCheckout}
                    disabled={isProcessingCheckout}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold font-sans text-sm shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {isProcessingCheckout
                         ? 'Syncing Ledger...'
                         : `Acquire via NEC — ${selectedEdition.price} NEC`}
                    </span>
                  </button>

                  {/* External Storefront Link (Payhip / Gumroad) */}
                  <a
                    id="link-external-payhip"
                    href={selectedEdition.directCheckoutUrl || ebookConfig.payhipUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition-colors border border-neutral-700"
                  >
                    <span>Payhip / Gumroad</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                </div>
              </div>

              {/* Reader Reviews */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                  Critical Acclaim & Reader Testimonials
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {ebookConfig.testimonials.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2 flex flex-col justify-between"
                    >
                      <p className="text-xs text-neutral-300 italic font-serif leading-relaxed">
                        "{t.quote}"
                      </p>
                      <div className="border-t border-neutral-800/80 pt-2">
                        <span className="text-xs font-bold text-white block font-sans">
                          {t.author}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 block">
                          {t.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                  Frequently Asked Questions
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {ebookConfig.faq.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/80 space-y-1"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold font-sans text-neutral-200">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{f.question}</span>
                      </div>
                      <p className="text-xs text-neutral-400 font-sans pl-5.5 leading-relaxed">
                        {f.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
