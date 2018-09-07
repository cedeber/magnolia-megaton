<toggle-item inline-template>
    <div ${model.style!}>
        <input type="checkbox" id="${content.value!}" name="${content.value!}"
               required="${content.mandatory!?c}">
        <label for="${content.value!}">${cmsfn.decode(content).label!}</label>
</toggle-item>
