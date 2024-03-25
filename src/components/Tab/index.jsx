export default function Tab(props) {
  return (
    <div
      className={`border rounded-lg bg-secondary px-1.5 py-1.5 flex items-center justify-center ${props.className}`}
    >
      {props.options.map((option, index) => (
        <div
          key={`tab-option-${index}`}
          className={`px-2.5 py-1.5 rounded-md text-sm font-semibold flex items-center justify-center cursor-pointer ${
            props.value === option
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground"
          }`}
          onClick={() => props.action(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
}
