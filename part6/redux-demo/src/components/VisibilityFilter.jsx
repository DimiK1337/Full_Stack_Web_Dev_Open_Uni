import { useDispatch } from "react-redux";

import { filterChange } from "../reducers/filterReducer";

const VisibilityFilter = () => {
  const dispatch = useDispatch()
  return (
    // Since the 'name' is the same for all inputs, a button group is formed where one option is selected for the value
    <div>
      all < input type = "radio" name = "filter" onChange = {() => dispatch(filterChange('ALL'))}/>
      important < input type = "radio" name = "filter" onChange = {() => dispatch(filterChange('IMPORTANT'))}/>
      nonimportant < input type = "radio" name = "filter" onChange = {() => dispatch(filterChange('NONIMPORTANT'))}/>
    </div> 
  )
}


export default VisibilityFilter