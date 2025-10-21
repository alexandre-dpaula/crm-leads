'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  size?: 'md' | 'lg';
}

export default function BaseModal({ open, onClose, title, description, children, size = 'md' }: BaseModalProps) {
  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-12">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`relative w-full rounded-3xl bg-white p-8 shadow-2xl ${
                  size === 'lg' ? 'max-w-2xl' : 'max-w-lg'
                }`}
              >
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <Dialog.Title className="text-xl font-semibold text-slate-900">{title}</Dialog.Title>
                {description ? (
                  <Dialog.Description className="mt-1 text-sm text-slate-500">{description}</Dialog.Description>
                ) : null}
                <div className="mt-6">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
