import { useState } from 'react'
import {
  Button,
  Form,
  InputComponentsEnum,
  SCHEMAS,
  type FormInput,
  type FormSchemaType,
} from '@/ui'

import styles from '../UiKit.module.scss'

export const FormStory = () => {
  const [isValid, setIsValid] = useState(false)
  const [formData] = useState({
    first_name: 'Farid',
    last_name: 'Shahidi',
    bio: 'This is my own bio',
    gender: 'male',
    salary: 123000,
    job: 'IT',
    role: '',
    accept_term_and_conditions: ['accept'],
  })

  const TEST_SCHEMA: FormSchemaType = SCHEMAS.wrapper({
    first_name: SCHEMAS.requiredString.min(6),
    last_name: SCHEMAS.requiredString.min(6),
    bio: SCHEMAS.requiredString,
    gender: SCHEMAS.mixed(['male']),
    role: SCHEMAS.mixed(['admin']),
  })

  const onChangeInput = (formData: any) => {
    console.log(formData)
  }

  const inputs: FormInput[] = [
    {
      name: 'first_name',
      label: 'First name',
      columns: 6,
      component: InputComponentsEnum.Text,
    },
    {
      name: 'last_name',
      label: 'Last name',
      columns: 6,
      component: InputComponentsEnum.Text,
      placeholder: 'Last name (with placeholder, required, debounce time)',
      required: true,
    },
    {
      name: 'bio',
      columns: 12,
      component: InputComponentsEnum.Textarea,
    },
    {
      name: 'salary',
      label: 'Salary',
      columns: 6,
      component: InputComponentsEnum.Text,
      unit: '$',
    },

    {
      name: 'role',
      columns: 6,
      component: InputComponentsEnum.Select,
      multiple: false,
      options: [
        {
          value: 'admin',
          label: 'Admin',
        },
        {
          value: 'guest',
          label: 'Guest',
        },
        {
          value: 3,
          label: 'User',
        },
      ],
    },
    {
      name: 'birth_date',
      columns: 6,
      component: InputComponentsEnum.Date,
    },
    {
      name: 'gender',
      columns: 6,
      component: InputComponentsEnum.RadioList,
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ],
    },
    {
      name: 'accept_term_and_conditions',
      columns: 6,
      component: InputComponentsEnum.Checklist,
      options: [
        {
          value: 'accept',
          label: 'Do you agree our terms?',
        },
        {
          value: 'email',
          label: 'Recieve email?',
        },
      ],
    },
    {
      name: 'Are you happy?',
      columns: 6,
      component: InputComponentsEnum.Toggle,
    },
    {
      name: 'Email content',
      columns: 12,
      component: InputComponentsEnum.Editor,
    },
  ]

  return (
    <div className={styles.story}>
      <h4>21) Form</h4>
      <pre>
        inputs: Form is a component that will build a form based on array of inputs in props.
        <br />
        schema: Form accepts an schema and do live validation based on that schema with statistics.
        <br />
        columns: For each input you can set width of the input based on 12 column grid.
        <br />
        onCahngeInput: You have access to current form data and current changed input via this
        callback.
        <br />
        Grouping fields: You can manage unlimit group in group inputs with not even 1 line of code.
      </pre>
      <div style={{ padding: 30, border: '1px solid #ccc', borderRadius: 10 }}>
        <Form
          inputs={inputs}
          schema={TEST_SCHEMA}
          defaultValues={formData}
          onChangeInput={onChangeInput}
          setIsValid={setIsValid}
          showErrorOnMount={true}
          showValidationBar={false}
        />
        <div style={{ float: 'right' }}>
          <Button onClick={() => {}} label='Submit' disabled={!isValid} />
        </div>
      </div>
    </div>
  )
}
