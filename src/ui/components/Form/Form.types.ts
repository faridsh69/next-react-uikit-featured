import type { ChangeEventHandler, FC, InputHTMLAttributes, ReactNode } from 'react'
import type { Control, FieldError } from 'react-hook-form'
import type * as yup from 'yup'

import type { IconsEnum, SizesEnum, VariantsEnum } from '../../enums/enums'
import type { OptionValueType } from '../../types/types'
import { CheckListProps } from '../CheckList/CheckList.types'
import { RadioListProps } from '../RadioList/RadioList.types'
import type { RatingProps } from '../Rating/Rating.types'
import { SelectProps } from '../Select/Select.types'
import { TextareaProps } from '../Textarea/Textarea.types'
import { TextInputProps } from '../TextInput/TextInput.types'
import type { InputComponentsEnum } from './Form.enums'

type CommonInputProps = {
  name: string
  label?: string
  columns?: number
  unit?: string
  hint?: string
  variant?: VariantsEnum
  handleChangeSearch?: (query: string) => void
}

type DatepickerProps = InputHTMLAttributes<HTMLInputElement>

export type CheckboxProps = {
  checked?: boolean
  linesCount?: number
  size?: SizesEnum
  onChange?: ChangeEventHandler<HTMLInputElement>
  label?: string
}

export type OptionType = {
  label: string
  value: OptionValueType
}

type CustomProps = {
  ControllerComponent: FC<InputControllerProps>
}

export type FormInput =
  | ({ component: InputComponentsEnum.Text } & CommonInputProps &
      TextInputProps & {
        icon?: IconsEnum
        debounceTime?: number
        size?: SizesEnum
      })
  | ({ component: InputComponentsEnum.Checkbox } & CommonInputProps & CheckboxProps)
  | ({ component: InputComponentsEnum.Checklist } & CommonInputProps & CheckListProps)
  | ({ component: InputComponentsEnum.Chips } & CommonInputProps & CheckListProps)
  | ({ component: InputComponentsEnum.RadioList } & CommonInputProps & RadioListProps)
  | ({ component: InputComponentsEnum.Toggle } & CommonInputProps)
  | ({ component: InputComponentsEnum.Textarea } & CommonInputProps & TextareaProps)
  | ({ component: InputComponentsEnum.Select } & CommonInputProps & SelectProps)
  | ({ component: InputComponentsEnum.Date } & CommonInputProps & DatepickerProps)
  | ({ component: InputComponentsEnum.Rating } & CommonInputProps & RatingProps)
  | ({ component: InputComponentsEnum.Uploader } & CommonInputProps)
  | ({ component: InputComponentsEnum.Custom } & CommonInputProps & CustomProps)
  | ({ component: InputComponentsEnum.Editor } & CommonInputProps)

export type FormSchemaType = yup.ObjectSchema<any>

export type FormProps = {
  inputs: FormInput[]
  values?: any
  defaultValues?: any
  onChangeInput?: (formData: any, changedInput: any) => void
  schema?: FormSchemaType
  showValidationBar?: boolean
  showErrorOnMount?: boolean
  setIsValid?: (isValid: boolean) => void
}

export type inputWrapperProps = {
  children: ReactNode
  error?: FieldError
}

export type InputControllerProps = {
  control: Control<any>
  name: string
  onChangeInput?: (changedInput: object) => void
  label?: string
  options?: OptionType[]
  multiple?: boolean
  inputs?: FormInput[]
  disabled?: boolean
  ControllerComponent?: FC<InputControllerProps>
  hiddenInputLabelsBasedOnIndex?: (index: number) => string[]
  noItemsLabel?: string
  errors?: any
  fieldName?: string
  checkPathInBreadcrumb?: boolean
  arrowButtonPath?: string
  breadCrumbOptions?: any
  handleChangeSearch?: (query: string) => void
  debounceTime?: number
}
