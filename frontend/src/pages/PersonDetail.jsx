import {useParams} from "react-router-dom";

export default function PersonDetail() {
    const {id} = useParams();
    return <div className = "text-lg font-semibold">Person #{id}</div>
}