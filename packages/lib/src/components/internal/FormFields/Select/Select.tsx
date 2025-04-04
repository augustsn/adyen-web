import { h } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import cx from 'classnames';
import SelectButton from './components/SelectButton';
import SelectList from './components/SelectList';
import uuid from '../../../../utils/uuid';
import { keys } from './constants';
import { SelectItem, SelectProps } from './types';
import './Select.scss';
import { ARIA_CONTEXT_SUFFIX, ARIA_ERROR_SUFFIX } from '../../../../core/Errors/constants';
import { simulateFocusScroll } from '../utils';

function Select({
    items = [],
    className = '',
    classNameModifiers = [],
    filterable = true,
    readonly = false,
    onChange = () => {},
    onInput,
    selectedValue,
    name,
    isInvalid,
    isValid,
    placeholder,
    uniqueId,
    disabled,
    disableTextFilter,
    clearOnSelect,
    blurOnClose,
    onListToggle,
    allowIdOnButton = false,
    required
}: SelectProps) {
    const filterInputRef = useRef(null);
    const selectContainerRef = useRef(null);
    const toggleButtonRef = useRef(null);
    const selectListRef = useRef(null);
    const [textFilter, setTextFilter] = useState<string>(null);
    const [showList, setShowList] = useState<boolean>(false);
    const selectListId: string = useMemo(() => `select-${uuid()}`, []);

    const active: SelectItem = items.find(i => i.id === selectedValue) || ({} as SelectItem);

    const [inputText, setInputText] = useState<string>();

    const [activeOption, setActiveOption] = useState<SelectItem>(active);

    const selectedOption = active;

    const filteredItems = disableTextFilter ? items : items.filter(item => !textFilter || item.name.toLowerCase().includes(textFilter.toLowerCase()));

    const suffix = isInvalid ? ARIA_ERROR_SUFFIX : ARIA_CONTEXT_SUFFIX;
    const ariaDescribedBy = uniqueId ? `${uniqueId}${suffix}` : null;

    const setNextActive = () => {
        if (!filteredItems || filteredItems.length < 1) return;
        const possibleNextIndex = filteredItems.findIndex(listItem => listItem === activeOption) + 1;
        const nextIndex = possibleNextIndex < filteredItems.length ? possibleNextIndex : 0;
        const nextItem = filteredItems[nextIndex];
        scrollToItem(nextItem);
        setActiveOption(nextItem);
    };

    const setPreviousActive = () => {
        if (!filteredItems || filteredItems.length < 1) return;
        const possibleNextIndex = filteredItems.findIndex(listItem => listItem === activeOption) - 1;
        const nextIndex = possibleNextIndex < 0 ? filteredItems.length - 1 : possibleNextIndex;
        const nextItem = filteredItems[nextIndex];
        scrollToItem(nextItem);
        setActiveOption(nextItem);
    };

    const scrollToItem = (item: SelectItem) => {
        if (!item) return;
        const nextElement = document.getElementById(`listItem-${item.id}`);
        simulateFocusScroll(nextElement);
    };

    /**
     * Closes the selectList, empties the text filter and focuses the button element
     */
    const closeList = () => {
        //blurs the field when the list is closed, makes for a better UX for most users, needs more testing
        blurOnClose && filterInputRef.current.blur();
        setShowList(false);
    };

    const openList = () => {
        setShowList(true);
    };

    const extractItemFromEvent = (e: Event): SelectItem => {
        const value = (e.currentTarget as HTMLInputElement).getAttribute('data-value');
        return filteredItems.find(listItem => listItem.id == value);
    };

    /**
     * Closes the select list and fires an onChange
     * @param e - Event
     */
    const handleSelect = (e: Event) => {
        e.preventDefault();

        // We use a local variable here since writing and if statement is cleaner then a long ternary
        let valueToEmit;

        if (e.currentTarget instanceof HTMLElement && e.currentTarget.getAttribute('role') === 'option') {
            // This is the main scenario when clicking and item in the list
            // Item comes from the event
            valueToEmit = extractItemFromEvent(e);
        } else if (activeOption.id && filteredItems.some(item => item.id === activeOption.id)) {
            // This is the scenario where a user is using the keyboard to navigate
            // In the case item comes from the visually select item
            valueToEmit = activeOption;
        } else {
            // This is the scenario the user didn't select anything
            if (textFilter) {
                // if we filtering for something then select the first option
                valueToEmit = filteredItems[0];
            } else {
                // This will happen when we want to keep an already chosen option
                // If no active option we should just emit again with the value that was already selected
                valueToEmit = { id: selectedValue };
            }
        }

        if (valueToEmit && !valueToEmit.disabled) {
            onChange({ target: { value: valueToEmit.id, name: name } });

            if (clearOnSelect) setInputText(null);

            closeList();
        }
    };

    /**
     * Handles hovering and directions
     * @param e - Event
     */
    const handleHover = (e: Event) => {
        e.preventDefault();
        const item = extractItemFromEvent(e);
        setActiveOption(item);
    };

    /**
     * Handle keyDown events on the selectList button
     * Responsible for opening and closing the list
     * @param e - KeyboardEvent
     */
    const handleButtonKeyDown = (e: KeyboardEvent) => {
        if (e.key === keys.enter && filterable && showList && textFilter) {
            handleSelect(e);
        } else if (e.key === keys.escape) {
            // When user has focused Select button but not yet moved into Select list - close list and keep focus on the Select Button re. a11y guidelines
            // https://w3c.github.io/aria-practices/examples/disclosure/disclosure-navigation.html
            closeList();
        } else if ([keys.arrowUp, keys.arrowDown, keys.enter].includes(e.key) || (e.key === keys.space && (!filterable || !showList))) {
            e.preventDefault();
            if (!showList) {
                openList();
            } else {
                handleNavigationKeys(e);
            }
        } else if (e.shiftKey && e.key === keys.tab) {
            // Shift-Tab out of Select - close list re. a11y guidelines (above)
            closeList();
        } else if (e.key === keys.tab) {
            closeList();
        }
    };

    /**
     * Handles movement with navigation keys and enter
     * Navigates through the list, or select an element, or focus the filter input, or close the menu.
     * @param e - KeyDownEvent
     */
    const handleNavigationKeys = (e: KeyboardEvent) => {
        switch (e.key) {
            case keys.space:
            case keys.enter:
                handleSelect(e);
                break;
            case keys.arrowDown:
                e.preventDefault();
                setNextActive();
                break;
            case keys.arrowUp:
                e.preventDefault();
                setPreviousActive();
                break;
            default:
        }
    };

    /**
     * Updates the state with the current text filter value
     * @param e - KeyboardEvent
     */
    const handleTextFilter = (e: KeyboardEvent) => {
        const value: string = (e.target as HTMLInputElement).value;
        setInputText(value);
        setTextFilter(value);
        if (onInput) {
            onInput(value);
        }
    };

    /**
     * Toggles the selectList and focuses in either the filter input or in the selectList button
     * @param e - Event
     */
    const toggleList = (e: Event) => {
        e.preventDefault();
        if (!showList) {
            setInputText(null);
            openList();
        } else {
            setInputText(selectedOption.name);
            closeList();
        }
    };

    useEffect(() => {
        if (showList) {
            setInputText(null);
        } else {
            setTextFilter(null);
        }
    }, [showList]);

    /**
     * Focus on the input if filterable
     */
    useEffect(() => {
        if (showList && filterable && filterInputRef.current) {
            filterInputRef.current.focus();
        }
        onListToggle?.(showList);
    }, [showList]);

    useEffect(() => {
        /**
         * Close the select list when clicking outside the list
         * @param e - MouseEvent
         */
        function handleClickOutside(e: MouseEvent) {
            // use composedPath so it can also check when inside a web component
            // if composedPath is not available fallback to e.target
            const clickIsOutside = e.composedPath
                ? !e.composedPath().includes(selectContainerRef.current)
                : !selectContainerRef.current.contains(e.target);
            if (clickIsOutside) {
                closeList();
            }
        }

        document.addEventListener('click', handleClickOutside, false);

        return () => {
            document.removeEventListener('click', handleClickOutside, false);
        };
    }, [selectContainerRef]);

    return (
        <div
            className={cx(['bubp-checkout__dropdown', className, ...classNameModifiers.map(m => `bubp-checkout__dropdown--${m}`)])}
            ref={selectContainerRef}
        >
            <SelectButton
                inputText={inputText}
                id={uniqueId ?? null}
                active={activeOption}
                selected={selectedOption}
                filterInputRef={filterInputRef}
                filterable={filterable}
                isInvalid={isInvalid}
                isValid={isValid}
                onButtonKeyDown={handleButtonKeyDown}
                onFocus={openList}
                onInput={handleTextFilter}
                placeholder={placeholder}
                readonly={readonly}
                selectListId={selectListId}
                showList={showList}
                toggleButtonRef={toggleButtonRef}
                toggleList={toggleList}
                disabled={disabled}
                ariaDescribedBy={ariaDescribedBy}
                allowIdOnButton={allowIdOnButton}
                required={required}
            />
            <SelectList
                active={activeOption}
                filteredItems={filteredItems}
                onHover={handleHover}
                onSelect={handleSelect}
                selected={selectedOption}
                selectListId={selectListId}
                selectListRef={selectListRef}
                showList={showList}
            />
        </div>
    );
}

Select.defaultProps = {
    className: '',
    classNameModifiers: [],
    filterable: true,
    items: [],
    readonly: false,
    onChange: () => {}
};

export default Select;
