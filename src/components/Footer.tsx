export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              CollegeHub
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your all-in-one college application resource. Find stats,
              financial aid, and more.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Quick Links
            </h3>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a
                  href="/colleges"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Browse Colleges
                </a>
              </li>
              <li>
                <a
                  href="/financial"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Financial Aid
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Data Source
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              College data sourced from the{" "}
              <a
                href="https://collegescorecard.ed.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                College Scorecard
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-500">
          © {new Date().getFullYear()} CollegeHub. For educational
          purposes only.
        </div>
      </div>
    </footer>
  );
}
