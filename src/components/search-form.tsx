import { useState } from "react";

export function SearchForm() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      alert("Please provide a query");
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.location.href = url.toString();
  };

  return (
    <form className="group m-2 flex w-full" onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        className="flex-1 rounded-l-md border-2 border-r-0 border-teal-800/90 bg-teal-950/50 p-3 text-teal-50 group-hover:border-teal-900/90 group-active:border-teal-950/90 placeholder:italic hover:text-teal-100/90 focus-visible:outline-hidden active:text-teal-200/90"
        placeholder="Search for everything..."
      />
      <button
        type="submit"
        className="cursor-pointer rounded-r-md bg-teal-800/90 px-4 py-2 text-lg text-teal-50 transition-colors group-hover:bg-teal-900/90 group-active:bg-teal-950/90 hover:text-teal-200/90 active:text-teal-200/90"
      >
        Search
      </button>
    </form>
  );
}
