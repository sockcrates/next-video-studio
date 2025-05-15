export function VideoListSkeleton() {
  return (
    <output className="animate-pulse">
      <div className="text-center text-4xl my-4">Videos</div>
      <div className="animate-pulse my-4">
        <div className="h-2 w-8" />
        <div className="border border-gray-300 p-2 rounded-md my-2 w-full" />
      </div>
      <div>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            className="animate-pulse border p-2 rounded-md my-6 h-[144px]"
            // biome-ignore lint/suspicious/noArrayIndexKey: loading skeleton
            key={idx}
          >
            <div className="bg-gray-700 rounded-full h-4 w-72 mb-4" />
            <div className="bg-gray-700 rounded-full h-4 w-42 mb-4" />
            <div className="bg-gray-700 rounded-full h-3.5 w-72 mb-2" />
            <div className="bg-gray-700 rounded-full h-3.5 w-68 mb-2" />
          </div>
        ))}
      </div>
    </output>
  );
}
