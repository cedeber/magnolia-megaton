<toggle-item inline-template :default-value="'${model.value!}'">
    <div ${model.style!}>
        <input type="checkbox" id="${content.value!}" name="${content.value!}"
               required="${content.mandatory!?c}">
        <label for="${content.value!}">${cmsfn.decode(content).label!}</label>
</toggle-item>
