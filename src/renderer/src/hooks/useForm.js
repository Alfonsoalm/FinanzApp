import { useState } from "react"

export const useForm = (initialForm={}) => {
  
    const [formState, setFormState] = useState(initialForm)
    console.log(formState)

    const onInputChange = ({target}) => {
        console.log(target)
        const {name, value} = target

        console.log(name, value)
        
        setFormState({
            ...formState,
            [name]: value,
        })
    }

    const formatDates = (event, name) => {

        const date = event.format('YYYY-MM-DD')
        
        onInputChange({
            target:{
                name,
                value:date
            }
        })
    }


    const onResetForm = () => {
        setFormState(initialForm)
    }
  
  
  return {
        formState,
        ...formState,
        onInputChange,
        onResetForm,
  }
}
