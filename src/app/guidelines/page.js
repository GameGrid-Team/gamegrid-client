'use client'
import Header from '../components/Header'
import { useEffect, useState } from 'react'
import LoadingOverlay from '../components/loading'
import SectionWrapper from '../components/textBackground'
export default function Policy() {
  return (
    <div className="p-8 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-white-800">Community Guidlines</h1>
      </header>
      <SectionWrapper>
        <h2 className="text-2xl font-semibold text-white-700 mb-4">1. Respect and Courtesy</h2>
        <ul className="list-disc list-inside text-white-600 mb-4">
          <li>
            Be Respectful: Treat all members of the GameGrid community with respect. Personal attacks,
            harassment, or hate speech will not be tolerated.
          </li>
          <li>
            No Discrimination: Discrimination based on race, gender, sexual orientation, religion, or
            disability is strictly prohibited.
          </li>
          <li>
            Constructive Criticism: Provide feedback in a constructive manner. Avoid trolling or derogatory
            comments.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white-700 mb-3">2. Content Rules</h3>
        <ul className="list-disc list-inside text-white-600 mb-4">
          <li>
            Appropriate Content: Share content that is appropriate for all audiences. Explicit, violent, or
            harmful content is not allowed.
          </li>
          <li>
            No Spamming: Avoid spamming posts or comments. Keep your interactions relevant and meaningful.
          </li>
          <li>
            Intellectual Property: Respect the intellectual property rights of others. Do not share or post
            content that you do not have the right to use.
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold text-white-700 mb-4">3. Privacy and Security</h2>
        <ul className="list-disc list-inside text-white-600 mb-4">
          <li>
            Protect Personal Information: Do not share your own or others&apos; personal information without
            consent. This includes addresses, phone numbers, and other sensitive data.
          </li>
          <li>Account Security: Keep your account credentials secure and do not share them with others.</li>
        </ul>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold text-white-700 mb-4">4. Reporting and Enforcement</h2>
        <ul className="list-disc list-inside text-white-600 mb-4">
          <li>
            Report Violations: If you see content or behavior that violates these guidelines, report it to us
            immediately.
          </li>
          <li>
            Enforcement: We reserve the right to take appropriate action, including removing content or
            banning users, to ensure the community remains welcoming and safe.
          </li>
        </ul>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-2xl font-semibold text-white-700 mb-4">5. Changes to Guidelines</h2>
        <ul className="list-disc list-inside text-white-600 mb-4">
          <li>
            Updates: These guidelines may be updated from time to time. Please review them regularly to stay
            informed of any changes.
          </li>
        </ul>
      </SectionWrapper>
    </div>
  )
}
