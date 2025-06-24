export default function Username({value,onChange}) {
return (
    <div className="flex flex-col w-full">
        <label className="input validator flex items-center gap-2">
            <svg
                className="h-5 w-5 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </g>
            </svg>
            <input
                type="text"
                value={value}
                onChange={onChange}
                required
                placeholder="Username"
                pattern="[A-Za-z][A-Za-z0-9\-]{2,29}"
                maxLength={30}
                minLength={3}
                className="flex-1 bg-transparent outline-none"
                title="Only letters, numbers or dash"
            />
        </label>
        <p className="validator-hint text-xs text-gray-500 hidden">
            Must be 3 to 30 characters<br />
            Only letters, numbers or dash
        </p>
    </div>
);
}
