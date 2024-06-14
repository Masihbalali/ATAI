### Enhance Search Functionality Tasks

1. **Filters**:

    - Created a state in **HomePage.tsx** and pass as a props to the **ContectPanel.tsx** to save user click and update FilterType state by using SetFilterType function.
    - Create new array to map the result with out filterType state in **SearchResults.tsx**
    ```Javascript
      const filteredFilesGroup = useMemo(
      () => filesGroup.filter((item) => !filterType || filterType === item.type || `.${filterType}`  === item.extension),
        [filesGroup, filterType]
      ); 
    ```

### Enhance Chat Functionality

1. **Edit Messages**
    - using editMessage and setEditMessage state in **HomePage.tsx** and pass setEditMessage as props to **ChatMessage.tsx** to select the message that user want to edit
   ```Javascript
   {
         role !== 'assistant' &&
         <button className={'bg-blue-500 h-full text-white p-2 rounded'} onClick={() => handleEdit(content)}>
           Edit
         </button>
       }
   ```
   ```Javascript
   const handleEdit = (text: string) => {
   setEditMessage(text)
    }
    ```
- then editMessage will update and propmt state will be update by using useEffect in **HomePage.tsx**
    ```Javascript
    useEffect(() => {
    setPrompt(editMessage)
    }, [editMessage])
  ```
