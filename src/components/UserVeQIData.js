/**
 * Component to show users data after connecting to Metamask 
 * @param {string} veQiBalance Users veQI balance
 * @param {string} veQiVotes   Users veQI votes 
 */
const UserVeQIData = ({ veQiBalance, veQiVotes}) => {
    return(
        <div>
            <table className="table-auto w-full mt-8">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">veQI Balance</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">veQI Votes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2 text-sm font-medium">{veQiBalance}</td>
          <td className="border px-4 py-2 text-sm font-medium">{veQiVotes}</td>
        </tr>
      </tbody>
    </table>
        </div>
    )
}

export default UserVeQIData