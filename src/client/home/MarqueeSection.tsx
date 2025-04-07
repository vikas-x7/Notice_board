"use client";

const mindMapNodes = [
  { name: "Create Notice" },
  { name: "Edit Notice" },
  { name: "Delete Notice" },
  { name: "Pin Notice" },
  { name: "Get Pinned Notices" },
  { name: "Upload Notice PDF" },
  { name: "Import Notices" },
  { name: "Export Notices" },
  { name: "Search Notices" },
  { name: "Filter Notices" },
];

export default function MarqueeSection() {
  return (
    <section className="w-full ">
      <div className="flex bg-[#F3F4F6]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...mindMapNodes, ...mindMapNodes].map((node, i) => (
            <span
              key={i}
              className=" text-black mx-5 sm:mx-8 md:mx-10 opacity-80 hover:opacity-100 transition-opacity duration-200 select-none text-[13px] sm:text-[15px] md:text-[13px]"
            >
              {node.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
