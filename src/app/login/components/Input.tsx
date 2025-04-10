export default function Input(props:inputProps){
    return <div className="input">
        <label htmlFor={props.name}>{props.label}</label>
        <input type={props.type} name={props.name} placeholder={'Please enter your ' + props.name}/>
    </div>
}

interface inputProps{
    name:string,
    type:string,
    label:string
}