'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  X, 
  Trash2, 
  Edit3, 
  Phone, 
  MessageCircle, 
  Info, 
  Lock, 
  Check, 
  AlertCircle,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { TrustedContact, ContactMethod, TrustedContactRelationship } from '@/types/safety';

interface TrustedCircleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

const RELATIONSHIP_OPTIONS: TrustedContactRelationship[] = [
  'Daughter',
  'Son',
  'Sister',
  'Brother',
  'Parent',
  'Friend',
  'Caregiver',
  'Spouse',
  'Other'
];

const CONTACT_METHODS: ContactMethod[] = ['WhatsApp', 'SMS', 'Phone Call'];

const AVATAR_COLORS = [
  { bg: '#1E3A2F', label: 'Emerald' },
  { bg: '#1D4ED8', label: 'Blue' },
  { bg: '#7C3AED', label: 'Purple' },
  { bg: '#D97706', label: 'Amber' },
  { bg: '#E11D48', label: 'Rose' },
];

export function TrustedCircleManagerModal({
  isOpen,
  onClose,
  language = 'en'
}: TrustedCircleManagerModalProps) {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<string>('Daughter');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('WhatsApp');
  const [contactValue, setContactValue] = useState('');
  const [avatarColor, setAvatarColor] = useState('#1E3A2F');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/trusted-circle');
      const data = await res.json();
      if (data?.contacts) {
        setContacts(data.contacts);
      }
    } catch (e) {
      console.error('Failed to fetch trusted contacts:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim() || !contactValue.trim()) {
      setErrorMessage('Please provide a name and contact number/handle.');
      return;
    }

    try {
      if (editingContactId) {
        // Update existing
        const res = await fetch(`/api/trusted-circle/${editingContactId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            relationship,
            contactMethod,
            contactValue: contactValue.trim(),
            avatarColor,
          }),
        });
        if (res.ok) {
          setSuccessMessage('Trusted contact updated successfully.');
          resetForm();
          fetchContacts();
        }
      } else {
        // Add new
        if (contacts.length >= 3) {
          setErrorMessage('You have reached the maximum limit of 3 trusted contacts.');
          return;
        }

        const res = await fetch('/api/trusted-circle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            relationship,
            contactMethod,
            contactValue: contactValue.trim(),
            avatarColor,
          }),
        });

        const data = await res.json();
        if (res.ok && data?.contact) {
          setSuccessMessage(`${name} added to your Trusted Circle.`);
          resetForm();
          fetchContacts();
        } else {
          setErrorMessage(data?.error || 'Could not add trusted contact.');
        }
      }
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleDeleteContact = async (id: string, contactName: string) => {
    try {
      const res = await fetch(`/api/trusted-circle/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts(prev => prev.filter(c => c.id !== id));
        setSuccessMessage(`${contactName} removed from your Trusted Circle.`);
      }
    } catch (e) {
      setErrorMessage('Failed to remove contact.');
    }
  };

  const startEdit = (c: TrustedContact) => {
    setEditingContactId(c.id);
    setName(c.name);
    setRelationship(c.relationship);
    setContactMethod(c.contactMethod);
    setContactValue(c.contactValue);
    setAvatarColor(c.avatarColor || '#1E3A2F');
    setIsAddingNew(true);
    setErrorMessage(null);
  };

  const resetForm = () => {
    setIsAddingNew(false);
    setEditingContactId(null);
    setName('');
    setRelationship('Daughter');
    setContactMethod('WhatsApp');
    setContactValue('');
    setAvatarColor('#1E3A2F');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-[#1E2024] rounded-[32px] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-labelledby="trusted-circle-title"
      >
        
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-white/10 flex items-start justify-between bg-slate-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1E3A2F] to-[#2D5A49] text-white flex items-center justify-center shadow-md">
              <HeartHandshake className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="trusted-circle-title" className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  👨‍👩‍👧 Trusted Circle
                </h2>
                <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                  {contacts.length}/3 Contacts
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                People you trust when you need a second opinion.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-500 dark:text-slate-400 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {/* CRITICAL PRIVACY GUARANTEE BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/40 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-extrabold text-emerald-900 dark:text-emerald-200 block">
                Strict Zero-Surveillance Privacy Guarantee
              </span>
              <p className="text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                «Your trusted people <strong>cannot see your activity, balance, or history</strong>. Nayan only contacts them when you <strong>explicitly ask for help</strong> on a specific situation.»
              </p>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ADD / EDIT FORM */}
          {isAddingNew ? (
            <form onSubmit={handleSaveContact} className="p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/10">
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                  {editingContactId ? 'Edit Trusted Person' : 'Add a Trusted Person (Max 3)'}
                </span>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Full Name / Nickname
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#18191D] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#18191D] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {RELATIONSHIP_OPTIONS.map((rel) => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Contact Method
                  </label>
                  <select
                    value={contactMethod}
                    onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#18191D] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {CONTACT_METHODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Phone Number / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 12345"
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#18191D] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Avatar Color Picker */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                  Avatar Color Badge
                </label>
                <div className="flex items-center gap-2">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c.bg}
                      type="button"
                      onClick={() => setAvatarColor(c.bg)}
                      className={`w-7 h-7 rounded-full transition-transform ${avatarColor === c.bg ? 'ring-2 ring-emerald-500 scale-110' : 'opacity-70 hover:opacity-100'}`}
                      style={{ backgroundColor: c.bg }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1E3A2F] hover:bg-[#2A4D3F] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingContactId ? 'Update Contact' : 'Save to Circle'}</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Existing Contacts List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Your Current Trusted Contacts ({contacts.length}/3)
                  </span>
                  {contacts.length < 3 && (
                    <button
                      onClick={() => {
                        resetForm();
                        setIsAddingNew(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E3A2F] hover:bg-[#2A4D3F] text-white text-xs font-black shadow-sm transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add Person</span>
                    </button>
                  )}
                </div>

                {contacts.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/15 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200/70 dark:bg-white/10 flex items-center justify-center mx-auto text-slate-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-slate-800 dark:text-white block">
                        No trusted people added yet
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-0.5">
                        Add a family member or close friend who can review suspicious payment requests or messages when you ask them.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddingNew(true)}
                      className="px-5 py-2 rounded-xl bg-[#1E3A2F] text-white text-xs font-black shadow-sm"
                    >
                      + Add First Contact
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between transition-all hover:border-slate-300 dark:hover:border-white/20"
                      >
                        <div className="flex items-center gap-3.5">
                          <div 
                            className="w-11 h-11 rounded-2xl text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0"
                            style={{ backgroundColor: contact.avatarColor || '#1E3A2F' }}
                          >
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                {contact.name}
                              </span>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                                {contact.relationship}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {contact.contactMethod === 'WhatsApp' ? (
                                <MessageCircle className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Phone className="w-3 h-3 text-blue-500" />
                              )}
                              <span>{contact.contactMethod} &bull; {contact.contactValue}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => startEdit(contact)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
                            title="Edit details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact.id, contact.name)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Remove from Trusted Circle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>End-to-End Encrypted &bull; Ephemeral Verification</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
