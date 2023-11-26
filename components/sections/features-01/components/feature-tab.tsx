type PricingPageProps = {
  icon: JSX.Element;
  label: string;
  tab: number;
  tabIndex: number;
  setTab: (tab: number) => void;
};

export default function FeatureTab({
  icon,
  label,
  tab,
  tabIndex,
  setTab
}: PricingPageProps) {
  return (
    <button
      className={`flex items-center text-sm font-medium text-slate-50 rounded border bg-slate-800/25 w-full px-3 py-2 transition duration-150 ease-in-out hover:opacity-100 ${
        tab !== tabIndex
          ? 'border-slate-700 opacity-50'
          : 'border-indigo-700 shadow shadow-indigo-500/25'
      }`}
      onClick={() => setTab(tabIndex)}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
