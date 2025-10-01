import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-indigo-900 to-blue-700 text-white">
      <div class="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div>
          <p class="text-blue-200 text-sm uppercase tracking-wider">Reliable. Personal. Fast.</p>
          <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Insurance that <span class="text-yellow-400">protects</span> your wealth
          </h2>
          <p class="mb-8 text-lg text-blue-100">
            Get the best insurance plans with complete transparency and trusted service.
          </p>
          <div class="flex gap-4">
            <!-- Register in new tab -->
            <a href="/register" target="_blank"
               class="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition">
              Get Started
            </a>
            <a routerLink="/contact" class="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-blue-700 transition">
              Contact Us
            </a>
          </div>
        </div>

        <!-- Right Image -->
        <div class="flex justify-center">
        <img 
          src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5" 
          alt="Insurance Support" 
          class="rounded-lg shadow-xl max-h-96"
        />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="max-w-7xl mx-auto px-6 py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
          <h3 class="text-xl font-semibold mb-3 text-gray-800">Guidance</h3>
          <p class="text-gray-600 mb-4">Talk to our experts and explore the best options tailored for you.</p>
          <a routerLink="/policy" class="text-blue-600 font-medium hover:underline">Learn more →</a>
        </div>

        <div class="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
          <h3 class="text-xl font-semibold mb-3 text-gray-800">Claims</h3>
          <p class="text-gray-600 mb-4">Easily file claims and track status with our simplified process.</p>
          <a routerLink="/claim" class="text-blue-600 font-medium hover:underline">Submit Claim →</a>
        </div>

        <div class="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
          <h3 class="text-xl font-semibold mb-3 text-gray-800">Secure Payments</h3>
          <p class="text-gray-600 mb-4">Make hassle-free online payments with full security and transparency.</p>
          <a routerLink="/payment" class="text-blue-600 font-medium hover:underline">Pay Now →</a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-gray-300 mt-6">
      <div class="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">

        <!-- Company Info -->
        <div>
          <h2 class="text-lg font-semibold text-white">Insurance Portal</h2>
          <p class="mt-3 text-gray-400 text-xs leading-relaxed">
            Empowering customers with secure, transparent and hassle-free insurance management.
          </p>
          <p class="mt-2 text-gray-400 text-xs">
            IRDAI Registered • ISO 27001 Certified
          </p>
        </div>

        <!-- Customer Support -->
        <div>
          <h3 class="font-semibold text-white mb-3">Customer Support</h3>
          <ul class="space-y-2">
            <li><span class="text-gray-400">Toll-Free:</span> <span class="font-medium">1800-123-456</span></li>
            <li>
              <span class="text-gray-400">Email:</span>
              <a href="mailto:support&#64;insuranceportal.com" class="hover:text-white transition">
                support&#64;insuranceportal.com
              </a>
            </li>
            <li><span class="text-gray-400">Working Hours:</span> Mon–Sat, 9am–7pm</li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="font-semibold text-white mb-3">Resources</h3>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-white transition">Policy Brochures</a></li>
            <li><a href="#" class="hover:text-white transition">Premium Calculator</a></li>
            <li><a href="#" class="hover:text-white transition">Claim Guidelines</a></li>
            <li><a href="#" class="hover:text-white transition">FAQs</a></li>
          </ul>
        </div>

        <!-- Connect With Us -->
        <div>
          <h3 class="font-semibold text-white mb-3">Connect With Us</h3>
          <div class="flex space-x-4">
            <a href="#" aria-label="Twitter" class="hover:text-white transition">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="LinkedIn" class="hover:text-white transition">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="#" aria-label="Facebook" class="hover:text-white transition">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="#" aria-label="Instagram" class="hover:text-white transition">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
          <p class="mt-3 text-gray-400 text-xs">
            Follow us for updates and offers.
          </p>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-indigo-700 py-4 text-center text-xs text-gray-400">
        © {{ currentYear }} KVL Insurance Management Portal. All Rights Reserved. 
        <span class="block md:inline"> | Licensed by IRDAI | CIN: U66000INCANER</span>
      </div>
    </footer>
  `
})
export class HomeComponent {
  currentYear = new Date().getFullYear();
}