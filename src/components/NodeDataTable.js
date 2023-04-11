    /**
     * Component to show every nodes data
     * @param {object} nodeDataList Node data object that includes nodeid, votes and weight data
     */
    const NodeDataTable = ({ nodeDataList }) => {

        return (
            <div> 
                <table className="table-auto w-40vw mt-8 hidden md:block "> 
                <thead>
                <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NodeId</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">veQI Weight</th>
                </tr>
                </thead> 
                <tbody>
            
                {nodeDataList && nodeDataList.map((node, index) => (
                    <tr key={index}> 
                        <td key={node.node} className="border px-4 py-2 text-sm font-medium">{node.node}</td>
                        <td key={node.votes} className="border px-4 py-2 text-sm font-medium">{node.votes}</td>
                        <td key={index} className="border px-4 py-2 text-sm font-medium">{node.weight} %</td> 
                    </tr>
                ))}

                </tbody>
            </table>

                 <div className="block md:hidden bg-gradient-to-r from-gray-900 to-blue-900 mt-8"> 
                 
               
                 {nodeDataList && nodeDataList.map((node, index) => (
                    <div key={index} className="block md:hidden text-xs text-white border-b border-gray-200 p-2">
                        <div key={node.node} className="my-2">
                            <p className="uppercase">NodeId</p>
                            <p>{node.node} </p>
                        </div>
                        <div className="my-2">
                            <p className="uppercase">Votes</p>
                            <p>{node.votes} </p>
                        </div>
                        <div className="my-2">
                            <p className="uppercase">Weight</p>
                            <p>{node.weight} % </p>
                        </div>
                    </div>
                    ))}
            </div>

            
        </div>
        )
    }

    export default NodeDataTable