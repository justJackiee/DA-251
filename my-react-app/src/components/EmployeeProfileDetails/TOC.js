import React, { useEffect, useState } from "react";

/**
 * Props:
 * - items: [{ id: "personal-info", label: "Personal Information", level: 1 }, ...]
 * - rootMargin: Vùng quan sát (mặc định bỏ qua 80% phía dưới để highlight chuẩn hơn khi cuộn)
 */
export default function TOC({ items = [], rootMargin = "-10% 0px -80% 0px" }) {
  const [activeId, setActiveId] = useState(items[0]?.id || "");

  useEffect(() => {
    if (!items.length) return;

    const elements = items
      .map((it) => document.getElementById(it.id))
      .filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Tìm các section đang hiển thị trong vùng quan sát
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin, // Dùng margin này để chỉ bắt active khi section lên gần đầu trang
        threshold: [0, 0.1, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer && observer.disconnect();
  }, [items, rootMargin]);

  const handleClick = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      // Chỉ dùng lệnh này, việc căn khoảng cách sẽ do CSS 'scroll-mt-24' bên ProfileDetails lo
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    // Thêm sticky top-20 để TOC trượt theo khi cuộn
    <nav className="bg-white rounded-2xl shadow p-4 sticky top-6">
      <h3 className="font-semibold text-gray-800 mb-4">Table of Contents</h3>
      <ul className="space-y-3 border-l-2 border-gray-100 pl-2">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} className="-ml-[10px]"> {/* Căn chỉnh lại chấm active */}
              <a
                href={`#${item.id}`}
                onClick={handleClick(item.id)}
                className={`block text-sm transition-all duration-200 py-1 pl-3 border-l-2 ${
                  active
                    ? "border-orange-500 text-orange-500 font-medium"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                } ${item.level > 1 ? "ml-4 text-xs" : ""}`}
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
