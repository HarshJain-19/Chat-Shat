import { WelcomeSVG } from "../../utils/WelcomeSVG";

export default function Welcome() {
  return (
    <div className="lg:col-span-2 lg:block bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center h-full">
        <WelcomeSVG />
        <h2 className="mt-4 text-lg text-center text-gray-600 dark:text-gray-400">
          Select a Chat to Start Messaging
        </h2>
      </div>
    </div>
  );
}
