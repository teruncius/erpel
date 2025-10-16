import { styled } from "styled-components";

import { HardFrostedEffectStyle } from "@erpel/ui/components/theme";

export const ThemedTextarea = styled.textarea`
    ${HardFrostedEffectStyle};

    width: 100%;
    box-sizing: border-box;

    padding: 0.5rem calc(1.618rem / 2);
    margin: 0;

    border: 0;
    border-radius: 0.5rem;
    font-size: 1rem;
    outline: none;
    color: #ffffff;
    field-sizing: content;
    resize: none;

    &::placeholder {
        color: #ffffff;
        font-style: italic;
    }
`;
