import React from "react";

const FooterBottom = () => {
  return (
    <>
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} ShopNest. All rights reserved.
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built with{" "}
            <span className="font-medium text-blue-600 dark:text-blue-400">
              Next.js
            </span>{" "}
            &{" "}
            <span className="font-medium text-blue-600 dark:text-blue-400">
              Tailwind CSS
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default FooterBottom;
