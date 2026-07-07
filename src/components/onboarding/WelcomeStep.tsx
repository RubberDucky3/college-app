"use client";

export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-6 text-6xl">🚀</div>
      <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Let&apos;s build your future together.
      </h1>
      <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
        Answer a few quick questions and we&apos;ll create a personalized plan
        to help you reach your goals.
      </p>
      <button
        onClick={onNext}
        className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl active:scale-95"
      >
        Get Started
      </button>
    </div>
  );
}
