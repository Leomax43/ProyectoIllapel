import ActionButton from '../ui/ActionButton.jsx';

function PageHeader({ title, subtitle, actions = [] }) {
  return (
    <div className="mb-6 border-b border-gray-300 pb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-xl text-[#333] font-normal">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <ActionButton
              key={action.label}
              onClick={action.onClick}
              variant={action.variant}
              disabled={action.disabled}
            >
              {action.label}
            </ActionButton>
          ))}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
