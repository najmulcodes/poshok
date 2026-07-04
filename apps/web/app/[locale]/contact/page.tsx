'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// TODO: replace with a real, monitored inbox before launch.
const CONTACT_EMAIL = 'hello@nevocore.app';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name || 'the Nevo website'}`);
    const body = encodeURIComponent(`${message}\n\n\u2014\n${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="bg-nevo-bg px-6 pb-24 pt-32 md:pt-36">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold text-nevo-ink md:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 text-lg text-nevo-ink-dim">
            Questions, feedback, or partnership ideas \u2014 we&apos;d like to hear them.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-2xl border border-nevo-line bg-nevo-panel-2 p-7">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Send message
          </Button>
          <p className="text-center text-xs text-nevo-ink-mute">
            Opens your email app with this message ready to send to {CONTACT_EMAIL}.
          </p>
        </form>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-6 flex items-center justify-center gap-2 text-sm text-nevo-ink-dim transition-colors hover:text-nevo-ink"
        >
          <Mail className="h-4 w-4" strokeWidth={1.75} />
          {CONTACT_EMAIL}
        </a>
      </div>
    </section>
  );
}
