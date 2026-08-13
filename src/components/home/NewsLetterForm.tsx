"use Client"

import { ArrowRight, Mail } from "lucide-react"
import { motion } from "framer-motion";

import type {
  Dispatch,
  FormEvent,
  SetStateAction,
} from "react";

type NewsLetterFormProps = {
  subscribed: boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
};


const NewsLetterForm = ({subscribed,handleSubmit,email,setEmail}:NewsLetterFormProps) => {
  return (
    <>
      {!subscribed ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="relative mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition "
              >
                Subscribe
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mx-auto mt-8 max-w-xl rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
            >
              🎉 Thanks for subscribing! You&apos;ll receive our latest
              updates and offers.
            </motion.div>
          )}
    </>
  )
}

export default NewsLetterForm