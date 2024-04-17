
The file is downloaded from 

Run this command in the console to get info in index

```
JSON.stringify(Array(...document.getElementsByTagName("tbody")[0].children).map(item=>(
    {
        lang: item.childNodes[0].textContent,
        name: item.childNodes[1].textContent,
        tran: item.childNodes[2].textContent,
        dl: item.childNodes[3].children[0].href + "?type=txt-2"
    }
)), null, 2)
```
