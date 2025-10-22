import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'users' | 'vendors' | 'technical';
}

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'What is Certify?',
      answer: 'Certify is a blockchain-powered certificate issuance platform that allows organizations to create, manage, and issue digital certificates as NFTs. Recipients truly own their certificates, and anyone can verify their authenticity instantly.',
      category: 'general'
    },
    {
      id: '2',
      question: 'How do I get started as a user?',
      answer: 'To get started as a user, simply connect your crypto wallet, browse available events, register for events you\'re interested in, attend them, and then mint your certificates using the token codes provided.',
      category: 'users'
    },
    {
      id: '3',
      question: 'What wallet do I need?',
      answer: 'You need a Web3 wallet like MetaMask, WalletConnect, or any Ethereum-compatible wallet. The wallet is used for authentication and to receive your NFT certificates.',
      category: 'technical'
    },
    {
      id: '4',
      question: 'How do I create an event as a vendor?',
      answer: 'Register as a vendor, connect your wallet, go to your dashboard, and click "Create Event". Fill in the event details, set up your whitelist requirements, and publish your event.',
      category: 'vendors'
    },
    {
      id: '5',
      question: 'Are the certificates really owned by me?',
      answer: 'Yes! Certificates are minted as NFTs directly to your wallet. You have full ownership and control over them. They cannot be revoked or taken away once minted.',
      category: 'users'
    },
    {
      id: '6',
      question: 'How can I verify a certificate?',
      answer: 'You can verify any certificate by visiting the verification page and entering the token ID. The blockchain will instantly confirm if the certificate is authentic and provide all relevant details.',
      category: 'general'
    },
    {
      id: '7',
      question: 'What happens if I lose access to my wallet?',
      answer: 'If you lose access to your wallet, you lose access to your certificates. This is the nature of blockchain ownership. Always backup your wallet seed phrase securely.',
      category: 'technical'
    },
    {
      id: '8',
      question: 'Can I revoke certificates as a vendor?',
      answer: 'Once a certificate is minted as an NFT, it cannot be revoked or deleted. However, you can mark certificates as revoked in our system, which will show up during verification.',
      category: 'vendors'
    },
    {
      id: '9',
      question: 'Is there a cost to mint certificates?',
      answer: 'There may be small blockchain transaction fees (gas fees) when minting certificates. The exact cost depends on network congestion at the time of minting.',
      category: 'technical'
    },
    {
      id: '10',
      question: 'Can I use certificates on other platforms?',
      answer: 'Yes! Since certificates are standard NFTs, they can be displayed in any NFT wallet, marketplace, or platform that supports NFTs. They\'re not locked to Certify.',
      category: 'users'
    },
    {
      id: '11',
      question: 'How do I manage my event whitelist?',
      answer: 'In your vendor dashboard, go to the specific event and click "View Whitelist". You can see all registered users, export the list, and revoke access if needed.',
      category: 'vendors'
    },
    {
      id: '12',
      question: 'What blockchain does Certify use?',
      answer: 'Certify is built on Ethereum, ensuring maximum compatibility and security. Your certificates are stored on the Ethereum blockchain permanently.',
      category: 'technical'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'General' },
    { id: 'users', label: 'For Users' },
    { id: 'vendors', label: 'For Vendors' },
    { id: 'technical', label: 'Technical' }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
         <Navigation />
        {/* Header */}
        <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Question</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Temukan jawaban atas pertanyaan umum tentang PPDB MTsN 1 Way Kanan
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.category === 'general' ? 'bg-blue-100 text-blue-800' :
                    item.category === 'users' ? 'bg-green-100 text-green-800' :
                    item.category === 'vendors' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {categories.find(c => c.id === item.category)?.label}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.question}
                  </h3>
                </div>
                {openItems.includes(item.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No questions found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or category filter
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 mb-16 bg-gradient-to-br from-primary via-primary to-secondary rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-blue-100 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@certify.com"
              className="bg-muted text-primary hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Contact Support
            </a>
            <a
              href="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}