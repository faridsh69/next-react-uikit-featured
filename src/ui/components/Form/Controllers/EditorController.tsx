import dynamic from 'next/dynamic'
import { Controller } from 'react-hook-form'

import 'react-quill-new/dist/quill.snow.css'

import { Label } from '../../Label/Label'
import { ErrorWrapper } from '../ErrorWrapper'
import { InputControllerProps } from '../Form.types'

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
})

const TEXT_EDITOR_MODULES = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    ['clean'],
  ],
}

const TEXT_EDITOR_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
]

export const EditorController = (props: InputControllerProps) => {
  const { control, onChangeInput, name, label, ...rest } = props

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <ErrorWrapper error={error}>
          <Label label={label} />
          <ReactQuill
            value={(value as string) ?? ''}
            onChange={onChange}
            modules={TEXT_EDITOR_MODULES}
            formats={TEXT_EDITOR_FORMATS}
            theme='snow'
            style={{ height: '150px', marginBottom: '40px' }}
            {...rest}
          />
        </ErrorWrapper>
      )}
    />
  )
}
