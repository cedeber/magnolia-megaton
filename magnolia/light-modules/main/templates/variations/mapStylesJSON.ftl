[@compress single_line=true]
[#if content.styles?has_content]
    ${cmsfn.decode(content).styles!}
[/#if]
[/@compress]
