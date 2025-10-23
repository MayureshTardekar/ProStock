import { Instagram, Linkedin, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border transition-theme">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About ProStock */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              About ProStock
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              ProStock is your all-in-one stock management and trading companion. Track your investments, monitor performance, and make smarter decisions with real-time insights.
            </p>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#help" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Help & FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#chat" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Chat Support
                </a>
              </li>
            </ul>
          </div>

          {/* Knowledge Center */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Knowledge Center</h4>
            <ul className="space-y-2">
              <li>
                <a href="#blogs" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Blogs & Insights
                </a>
              </li>
              <li>
                <a href="#tutorials" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#api" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Investment Options */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Investment Options</h4>
            <ul className="space-y-2">
              <li>
                <a href="#stocks" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Stocks
                </a>
              </li>
              <li>
                <a href="#fno" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  FnO
                </a>
              </li>
              <li>
                <a href="#mutual-funds" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Mutual Funds
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © 2025 ProStock. All Rights Reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-all hover:shadow-elegant group"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-all hover:shadow-elegant group"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-all hover:shadow-elegant group"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-all hover:shadow-elegant group"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
