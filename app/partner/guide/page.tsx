'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

const guideSections = [
  {
    id: 'product-photography',
    title: 'Product Photography',
    content: (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Golden Rules for Great Product Photos</h3>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li>Always photograph products against a clean white or light neutral background.</li>
            <li>Use natural daylight. Avoid using camera flash — it creates harsh shadows and washed-out colours.</li>
            <li>Keep the camera at the same level as the product, not angled from above or below.</li>
            <li>Clean the product thoroughly before photographing. Remove dust, lint, and fingerprints.</li>
            <li>Use a plain white sheet or wall as background for the hero shot.</li>
            <li>Take photos in a well-lit room near a window, preferably during daylight hours.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Lighting Guidance</h3>
          <p className="text-stone-700 mb-3">Good lighting makes the biggest difference. Here is how to get it right:</p>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li>Best time for natural light: morning or late afternoon (avoid harsh midday sun).</li>
            <li>Set up near a window with indirect daylight. The product should not be in direct sunbeam.</li>
            <li>If shooting indoors, use two light sources on either side to eliminate shadows.</li>
            <li>Avoid mixed lighting — do not mix yellow (tungsten) and blue (daylight) sources.</li>
            <li>Overcast days are actually ideal because clouds act as a natural softbox.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Background Guidance</h3>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li>White background is preferred for e-commerce and marketplace listings.</li>
            <li>Use a plain white sheet, white wall, or white poster board.</li>
            <li>Make sure the background is smooth without wrinkles or patterns.</li>
            <li>For lifestyle shots, use natural backgrounds like wooden tables or fabric.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Required Photograph Types</h3>
          <div className="space-y-4">
            <PhotoType title="Hero Shot (Front View)" desc="The primary image that represents your product. Show the full product facing directly forward, clean background, good lighting." />
            <PhotoType title="Back / Reverse Side" desc="Show the other side of the product. This helps buyers understand the complete craftsmanship." />
            <PhotoType title="Detail Close-ups" desc="Close photographs showing the weave, embroidery, print, or special design work. Customers need to see the quality." />
            <PhotoType title="Maker Photo" desc="A photo of the artisan or weaver who made the product. This personal touch builds trust." />
            <PhotoType title="Workspace Photo" desc="Show where the product is made. The loom, workshop, or workspace tells the story of authentic craftsmanship." />
            <PhotoType title="Lifestyle / Drape Photo" desc="Show the product being worn or used. For sarees, show it draped. For home decor, show it in a home setting." />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Photo Checklist</h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-medium text-amber-900 mb-2">Make sure you have:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-800">
              <li>✅ Hero shot (front view)</li>
              <li>✅ Back side photo</li>
              <li>✅ At least 3 detail close-up photos</li>
              <li>✅ Maker photo</li>
              <li>✅ Workspace photo</li>
              <li>✅ Lifestyle/drape photo</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Common Photography Mistakes to Avoid</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              ['Using camera flash', 'Creates glare on silks and hard shadows'],
              ['Dark or blurry photos', 'Use better lighting and steady hands'],
              ['Busy or messy backgrounds', 'Use plain white or neutral backgrounds'],
              ['Product too small in frame', 'Fill 60-70% of the frame with product'],
              ['Skipping detail shots', 'Close-ups show the real quality of craft'],
              ['Only one angle', 'Show front, back, and close-ups'],
            ].map(([mistake, fix]) => (
              <div key={mistake} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-medium text-red-900">❌ {mistake}</p>
                <p className="text-sm text-red-700 mt-1">→ {fix}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'product-video',
    title: 'Product Video',
    content: (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Why Videos Matter</h3>
          <p className="text-stone-700">Videos bring your products to life. Customers can see the drape, the movement, and the craftsmanship in action. A good video significantly increases buyer confidence.</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Video Types You Should Record</h3>
          <div className="space-y-4">
            <VideoType title="30-Second Product Video" desc="A short, elegant overview of your product. Hold the product steady, rotate it slowly, and let the light show its beauty. Keep it under 30 seconds." />
            <VideoType title="Full Product Clip" desc="A complete walkthrough. Show the product from every angle, zoom into details, and show the back side." />
            <VideoType title="Detail Clip" desc="Focus on the craftsmanship — the weave pattern, embroidery work, print quality, or special features. Move the camera slowly so buyers can see every detail." />
            <VideoType title="Drape / Movement Clip" desc="For wearable products like sarees, dupattas, and shawls — show how the fabric moves, drapes, and flows when worn." />
            <VideoType title="Maker Video" desc="A short video of the artisan at work. This is incredibly powerful for telling your story and building emotional connection." />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Video Tips</h3>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li>Use good natural lighting — same principles as photography apply.</li>
            <li>Keep the camera steady. Rest it on a table or wall if needed.</li>
            <li>Speak clearly if you want to add voice — explain the product in your own words.</li>
            <li>Each video should be between 15 seconds and 2 minutes.</li>
            <li>Keep file sizes manageable (under 100MB per video).</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'maker-story',
    title: 'Maker Story',
    content: (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Why Your Story Matters</h3>
          <p className="text-stone-700">Every product carries the heart of its maker. Buyers connect deeply with authentic stories. Your story makes your product unique and worth more than any mass-produced alternative.</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Product Information</h3>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li>What is the product name in your language?</li>
            <li>What is the English name?</li>
            <li>What category does it belong to?</li>
            <li>What is the price?</li>
            <li>What is the product description?</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Craft & Story Questions</h3>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li>What makes this product special?</li>
            <li>What materials are used?</li>
            <li>What is the craft or weaving technique?</li>
            <li>How long does it take to create?</li>
            <li>What is the traditional use?</li>
            <li>Does it have any cultural significance?</li>
            <li>Is there an additional story behind this product?</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Maker Information</h3>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li>What is your full name?</li>
            <li>How old are you?</li>
            <li>Where do you live?</li>
            <li>How long have you been practicing this craft?</li>
            <li>Who taught you this craft?</li>
            <li>Is this a family tradition?</li>
            <li>How many generations have practiced this craft in your family?</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Personal Story</h3>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li>What were your thoughts while making this product?</li>
            <li>What feelings did you experience?</li>
            <li>Any special memories connected to this product?</li>
            <li>Is there a personal message you would like to share with buyers?</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Shop Information</h3>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li>What is your shop name?</li>
            <li>How many years has it been in operation?</li>
            <li>Where is it located?</li>
            <li>What is your stock situation?</li>
            <li>Do you make the products yourself or source them?</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'how-to-send',
    title: 'How to Send Products',
    content: (
      <div className="space-y-6">
        <p className="text-stone-700 text-lg">Once your product is approved, here is how you send it:</p>
        <div className="space-y-4">
          {[
            ['Step 1: Packaging', 'Use sturdy packaging. Wrap fabric products in acid-free paper to protect them. Use bubble wrap for fragile items.'],
            ['Step 2: Label Clearly', 'Write your partner ID and product ID on the package. Include a printed copy of the product details.'],
            ['Step 3: Choose a Reliable Courier', 'Use a trusted courier service like India Post Speed Post, DTDC, Blue Dart, or any reliable local courier.'],
            ['Step 4: Get Tracking Number', 'Always keep the tracking number. Share it with the Pandaverse team.'],
            ['Step 5: Shipping Address', 'The shipping address will be provided to you once your product is approved for listing.'],
            ['Step 6: Insurance', 'Consider insuring high-value shipments. Make sure the courier company provides a receipt.'],
          ].map(([step, desc]) => (
            <div key={step} className="bg-white border border-stone-200 rounded-lg p-5">
              <h4 className="font-semibold text-stone-900">{step}</h4>
              <p className="text-stone-700 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'pricing',
    title: 'Pricing',
    content: (
      <div className="space-y-6">
        <p className="text-stone-700">Setting the right price is important for both you and your buyers.</p>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">What to Include in Your Price</h3>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li>Cost of raw materials</li>
            <li>Time spent creating the product</li>
            <li>Skill and craftsmanship value</li>
            <li>Packaging costs</li>
            <li>Shipping costs (if applicable)</li>
            <li>Fair profit margin for sustainability</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-3">Pricing Tips</h3>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li>Research similar products in the market to understand pricing ranges.</li>
            <li>Do not underprice — your craft has real value and takes real time.</li>
            <li>Consider the uniqueness and cultural value of your product.</li>
            <li>Be transparent about what the price includes.</li>
          </ul>
        </div>

        <div className="bg-pandaverse-50 border border-pandaverse-200 rounded-lg p-4">
          <p className="text-pandaverse-900 font-medium">Note: Pandaverse may suggest pricing adjustments based on market research, but the final price is always your decision.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'what-happens-next',
    title: 'What Happens After Submission',
    content: (
      <div className="space-y-6">
        <p className="text-stone-700">Here is exactly what happens after you submit a product:</p>

        <div className="space-y-4">
          {[
            ['Review', 'Your product submission is reviewed by the Pandaverse team within 3-5 working days.'],
            ['Feedback', 'If any information is missing or needs improvement, we will send you feedback through the portal.'],
            ['Photography Check', 'We review your photos for quality, clarity, and completeness.'],
            ['Approval', 'Once approved, your product goes live on the platform and becomes visible to customers.'],
            ['Orders', 'When a customer orders your product, you will receive a notification.'],
            ['Shipping', 'You ship the product to the customer using the provided address.'],
            ['Payment', 'Payment is processed after the product is delivered.'],
          ].map(([step, desc]) => (
            <div key={step} className="flex gap-4 items-start bg-white border border-stone-200 rounded-lg p-5">
              <div className="w-10 h-10 bg-pandaverse-100 rounded-full flex items-center justify-center text-pandaverse-700 font-bold shrink-0">✓</div>
              <div>
                <h4 className="font-semibold text-stone-900">{step}</h4>
                <p className="text-stone-700 mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'faq',
    title: 'Questions & Answers',
    content: (
      <div className="space-y-4">
        {[
          ['Do I need to pay to become a partner?', 'No, joining as a Pandaverse Gharana Partner is completely free.'],
          ['Can I upload products in my local language?', 'Yes! We encourage you to use both your local language and English.'],
          ['How many products can I upload?', 'Unlimited. Upload as many products as you want.'],
          ['Do I need professional photography equipment?', 'No. A good smartphone camera with natural lighting is sufficient.'],
          ['Can I edit my products after submission?', 'Yes, you can update product details and photos anytime from your dashboard.'],
          ['How long does review take?', 'Typically 3-5 working days.'],
          ['Who handles customer communication?', 'Pandaverse handles customer queries. You focus on creating and shipping.'],
          ['How do I receive payment?', 'Payments are transferred to your bank account after delivery confirmation.'],
          ['Can I be an individual artisan or do I need a shop?', 'Both are welcome. Individual artisans are our core community.'],
          ['What if my product does not get approved?', 'We will provide feedback on what needs improvement. You can resubmit after making changes.'],
        ].map(([q, a]) => (
          <div key={q} className="bg-white border border-stone-200 rounded-lg p-5">
            <h4 className="font-semibold text-stone-900 mb-2">Q: {q}</h4>
            <p className="text-stone-700">A: {a}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'quick-reference',
    title: 'Quick Reference Card',
    content: (
      <div className="space-y-6">
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Photography Checklist</h3>
          <div className="space-y-2">
            {['Hero shot (front view)', 'Back/reverse side photo', '3+ detail close-up photos', 'Maker photo', 'Workspace photo', 'Lifestyle/drape photo'].map(item => (
              <label key={item} className="flex items-center gap-3 text-stone-700">
                <input type="checkbox" disabled className="w-4 h-4" />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Video Checklist</h3>
          <div className="space-y-2">
            {['Full product video (under 2 min)', 'Detail clip', 'Drape/movement clip (if applicable)', 'Maker at work video (optional but recommended)'].map(item => (
              <label key={item} className="flex items-center gap-3 text-stone-700">
                <input type="checkbox" disabled className="w-4 h-4" />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Story Checklist</h3>
          <div className="space-y-2">
            {['Product name (local + English)', 'Category & Price', 'Description', 'Product story', 'Maker details', 'Shop information', 'All photographs uploaded', 'All videos uploaded'].map(item => (
              <label key={item} className="flex items-center gap-3 text-stone-700">
                <input type="checkbox" disabled className="w-4 h-4" />
                {item}
              </label>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

function PhotoType({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-4">
      <h4 className="font-semibold text-stone-900">{title}</h4>
      <p className="text-stone-700 mt-1 text-sm">{desc}</p>
    </div>
  );
}

function VideoType({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-4">
      <h4 className="font-semibold text-stone-900">{title}</h4>
      <p className="text-stone-700 mt-1 text-sm">{desc}</p>
    </div>
  );
}

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState(guideSections[0].id);
  const pathname = usePathname();

  const currentIndex = guideSections.findIndex(s => s.id === activeSection);
  const currentSection = guideSections[currentIndex];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/partner/dashboard" className="flex items-center gap-2 text-stone-600 hover:text-stone-800">
            ← Dashboard
          </Link>
          <h1 className="font-semibold text-stone-900">Pandaverse Guide</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* TOC Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-8">
              <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Contents</h2>
              <nav className="space-y-1">
                {guideSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === section.id ? 'bg-pandaverse-100 text-pandaverse-800 font-medium' : 'text-stone-600 hover:bg-stone-100'}`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-10">
              {currentSection && (
                <div>
                  <h2 id={currentSection.id} className="text-3xl font-bold text-stone-900 mb-8">{currentSection.title}</h2>
                  <div className="prose prose-stone max-w-none">
                    {currentSection.content}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between mt-12 pt-8 border-t border-stone-200">
                    {currentIndex > 0 ? (
                      <button
                        onClick={() => {
                          const prev = guideSections[currentIndex - 1];
                          setActiveSection(prev.id);
                          document.getElementById(prev.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1 text-pandaverse-700 hover:text-pandaverse-800 font-medium"
                      >
                        ← {guideSections[currentIndex - 1].title}
                      </button>
                    ) : <div />}
                    {currentIndex < guideSections.length - 1 ? (
                      <button
                        onClick={() => {
                          const next = guideSections[currentIndex + 1];
                          setActiveSection(next.id);
                          document.getElementById(next.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1 text-pandaverse-700 hover:text-pandaverse-800 font-medium"
                      >
                        {guideSections[currentIndex + 1].title} →
                      </button>
                    ) : <div />}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
