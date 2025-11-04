import React, { useEffect, useState } from "react";

/**
 * Props:
 * - items: [{ id: "personal-info", label: "Personal Information", level: 1 }, ...]
 * - rootMargin (optional): string for IntersectionObserver rootMargin
 */
export default function TOC({ items = [], rootMargin = "0px 0px -60% 0px" }) {
  const [activeId, setActiveId] = useState(items[0]?.id || "");

  useEffect(() => {
    if (!items.length) return;

    const elements = items
      .map((it) => document.getElementById(it.id))
      .filter(Boolean);

    if (!elements.length) return;

    let observer = new IntersectionObserver(
      (entries) => {
        // Sort by intersectionRatio to pick the most visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        } else {
          // If none intersecting, pick the last one that is above viewport
          const above = entries
            .filter((e) => e.boundingClientRect.top < 0)
            .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);
          if (above.length > 0) setActiveId(above[0].target.id);
        }
      },
      {
        root: null,
        rootMargin,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer && observer.disconnect();
  }, [items, rootMargin]);

  const handleClick = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // small offset if you have a sticky header
      window.scrollBy(0, -20);
    }
  };

  return (
    <nav className="bg-white rounded-2xl shadow p-4 sticky top-20">
      <ul className="space-y-3">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={handleClick(item.id)}
                className={`block text-sm transition-colors ${
                  active
                    ? "text-orange-500 font-medium border-l-2 pl-3 border-orange-500"
                    : "text-gray-600 hover:text-gray-800"
                } ${item.level > 1 ? "pl-6 text-xs" : ""}`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
