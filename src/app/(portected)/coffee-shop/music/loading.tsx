function loading() {
  return (
    <>
      <div className="mx-10 grid grid-cols-1 md:grid-cols-3 justify-center gap-20">
        <div className="items-center w-36 mx-auto flex gap-5 p-4 rounded-lg shadow-sm h-20 animate-pulse bg-gray-200" />
        <div className="items-center w-36 mx-auto flex gap-5 p-4 rounded-lg shadow-sm h-20 animate-pulse bg-gray-200" />
        <div className="items-center w-36 mx-auto flex gap-5 p-4 rounded-lg shadow-sm h-20 animate-pulse bg-gray-200" />
      </div>
      <div className="items-center mr-5 flex gap-5 p-4 rounded-lg shadow-sm h-16 mt-10 animate-pulse bg-gray-200" />
      <div className="mt-10 border border-gray-200 p-5 rounded-lg space-y-5">
        <div className="items-center mx-auto flex gap-5 p-4 rounded-lg shadow-sm h-16 animate-pulse bg-gray-200" />
        <div className="items-center mx-auto flex gap-5 p-4 rounded-lg shadow-sm h-16 animate-pulse bg-gray-200" />
        <div className="items-center mx-auto flex gap-5 p-4 rounded-lg shadow-sm h-16 animate-pulse bg-gray-200" />
      </div>
    </>
  );
}

export default loading;
