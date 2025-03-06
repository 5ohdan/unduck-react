import { useState, useRef, useEffect } from "react";
import { getCustomBangs, addCustomBang, removeCustomBang } from "../helpers";

export interface CustomBang {
  t: string;
  u: string;
  custom: boolean;
}

export function CustomBangs({
  checkBangExists,
}: {
  checkBangExists: (trigger: string) => boolean;
}) {
  const [customBangs, setCustomBangs] =
    useState<CustomBang[]>(getCustomBangs());

  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [trigger, setTrigger] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(1px);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    if (isOpen) {
      dialogElement.showModal();
    } else {
      dialogElement.close();
    }

    const handleClose = () => setIsOpen(false);
    dialogElement.addEventListener("close", handleClose);

    const handleBackdropClick = (e: MouseEvent) => {
      const dialogRect = dialogElement.getBoundingClientRect();

      if (
        e.clientX < dialogRect.left ||
        e.clientX > dialogRect.right ||
        e.clientY < dialogRect.top ||
        e.clientY > dialogRect.bottom
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      dialogElement.addEventListener("mousedown", handleBackdropClick);
    }

    return () => {
      dialogElement.removeEventListener("close", handleClose);
      dialogElement.removeEventListener("mousedown", handleBackdropClick);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isUrlValid = url.includes("{{{s}}}");

    if (!trigger || !url) {
      alert("Please provide a trigger and URL");
      return;
    }

    if (!isUrlValid) {
      alert("Please provide a valid URL");
      return;
    }

    if (checkBangExists(trigger)) {
      alert("Bang already exists");
      return;
    }

    addCustomBang(trigger, url);
    setCustomBangs(getCustomBangs());
    setTrigger("");
    setUrl("");
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          className="focus:ring-opacity-20 flex h-10 items-center justify-center rounded-md bg-teal-950/90 px-4 font-medium text-teal-100 shadow-sm transition-colors hover:bg-teal-800/90 hover:text-teal-200 focus:ring-2 focus:ring-teal-800 focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          Custom Shortcuts
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-neutral-800 bg-neutral-900 p-0 text-neutral-100 shadow-xl backdrop:bg-black/50"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <h2 className="text-xl font-medium text-teal-300">
            Create custom shortcuts
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-800"
          >
            <span className="text-neutral-400">Close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">
                Trigger
                <span className="ml-1 font-normal text-neutral-400">
                  A short keyword you'll type to activate the shortcut
                </span>
              </div>
              <input
                type="text"
                placeholder="Enter a short keyword (e.g., 'yt', 'maps')"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">
                URL
                <span className="ml-1 font-normal text-neutral-400">
                  The destination with optional{" "}
                  <span className="font-mono text-teal-300">{"{{s}}"}</span> for
                  search terms
                </span>
              </div>
              <input
                type="text"
                placeholder="Enter URL with optional {{s}} for search terms"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-md bg-teal-500/20 px-4 py-2 text-sm font-medium text-teal-100 hover:bg-teal-500/30 focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:outline-none disabled:opacity-50"
          >
            Add Shortcut
          </button>

          <div className="flex items-start gap-2 rounded-md bg-teal-500/10 p-3 text-xs text-neutral-300">
            <div>
              <span className="font-medium text-teal-200">Example:</span>{" "}
              Trigger{" "}
              <span className="rounded bg-neutral-800 px-1 font-mono">yt</span>{" "}
              with URL{" "}
              <span className="rounded bg-neutral-800 px-1 font-mono">
                https://youtube.com/results?search_query={"{{s}}"}
              </span>{" "}
              will let you search YouTube directly.
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-neutral-800">
            <div className="border-b border-neutral-800 bg-neutral-800/50 px-6 py-3">
              <h3 className="text-sm font-medium text-teal-200">
                Your shortcuts
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-800/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400">
                    Trigger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400">
                    URL
                  </th>
                  <th className="w-[80px] px-6 py-3 text-left text-xs font-medium text-neutral-400"></th>
                </tr>
              </thead>
              <tbody>
                {customBangs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="h-24 px-6 py-4 text-center text-neutral-400"
                    >
                      No custom shortcuts yet
                    </td>
                  </tr>
                ) : (
                  customBangs.map((customBang, index) => (
                    <tr key={index} className="border-b border-neutral-800">
                      <td className="px-6 py-3 text-sm font-medium text-teal-100">
                        {customBang.t}
                      </td>
                      <td className="max-w-[300px] truncate px-6 py-3 font-mono text-xs">
                        {customBang.u}
                      </td>
                      <td className="px-6 py-3">
                        <button onClick={() => removeCustomBang(customBang.t)}>
                          <span className="text-red-500">Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="overflow-hidden rounded-md border border-neutral-800">
            <div className="border-b border-neutral-800 bg-neutral-800/50 px-6 py-3">
              <h3 className="text-sm font-medium text-teal-200">
                How it works
              </h3>
            </div>
            <div className="px-6 py-4">
              <ol className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-xs font-medium text-teal-300">
                    1
                  </span>
                  <span>
                    Add a trigger and URL above (e.g.,{" "}
                    <span className="rounded bg-neutral-800 px-1 font-mono">
                      g
                    </span>{" "}
                    and{" "}
                    <span className="rounded bg-neutral-800 px-1 font-mono">
                      https://google.com/search?q={"{{s}}"}
                    </span>
                    )
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-xs font-medium text-teal-300">
                    2
                  </span>
                  <span>
                    When you type{" "}
                    <span className="rounded bg-neutral-800 px-1 font-mono">
                      g cats
                    </span>{" "}
                    in your browser's address bar, it redirects to{" "}
                    <span className="rounded bg-neutral-800 px-1 font-mono">
                      https://google.com/search?q=cats
                    </span>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-xs font-medium text-teal-300">
                    3
                  </span>
                  <span>
                    The{" "}
                    <span className="font-mono text-teal-300">{"{{s}}"}</span>{" "}
                    placeholder gets replaced with whatever you type after the
                    trigger
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
}
