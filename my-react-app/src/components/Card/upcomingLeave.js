export default function UpcomingLeave() {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-72 h-48 overflow-y-auto gap-4 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800">
        Upcoming Leaves
      </h2>
      <ul className="space-y-3">
        <li className="flex justify-between text-sm">
          <span>Emily Nguyen</span>
          <span className="text-gray-500">Oct 18–20</span>
        </li>
        <li className="flex justify-between text-sm">
          <span>Kevin Tran</span>
          <span className="text-gray-500">Oct 22</span>
        </li>
        <li className="flex justify-between text-sm">
          <span>Kevin Tran</span>
          <span className="text-gray-500">Oct 22</span>
        </li>
        <li className="flex justify-between text-sm">
          <span>Kevin Tran</span>
          <span className="text-gray-500">Oct 22</span>
        </li>
        <li className="flex justify-between text-sm">
          <span>Kevin Tran</span>
          <span className="text-gray-500">Oct 22</span>
        </li>
       
      </ul>
    </div>
  );
}
