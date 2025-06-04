import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Button, Popover } from 'antd'
import type { ButtonProps } from 'antd'
import { getBinaryFileURL } from '../../utils'
import { CopyOutlined } from '@ant-design/icons'

const popoverContentOpts = {
  default: 'Copy raw contents',
  copied: 'Copied!',
}

interface CopyFileButtonProps extends ButtonProps {
  open: boolean
  version: string
  path: string
  packageName: string
}

const CopyFileButton = styled(
  ({
    open,
    version,
    path,
    packageName,
    ...props
  }: CopyFileButtonProps) => {
    const [popoverContent, setPopoverContent] = useState(
      popoverContentOpts.default
    )

    const fetchContent = () =>
      fetch(getBinaryFileURL({ packageName, version, path })).then((response) =>
        response.text()
      )

    const copyContent = () => {
      // From https://wolfgangrittner.dev/how-to-use-clipboard-api-in-firefox/
      // eslint-disable-next-line no-constant-binary-expression
      if (typeof ClipboardItem && navigator.clipboard.write) {
        const item = new ClipboardItem({
          'text/plain': fetchContent().then(
            (content) => new Blob([content], { type: 'text/plain' })
          ),
        })

        return navigator.clipboard.write([item])
      } else {
        return fetchContent().then((content) =>
          navigator.clipboard.writeText(content)
        )
      }
    }

    if (!open) {
      return null
    }

    return (
      <Popover content={popoverContent} trigger="hover">
        <Button
          {...props}
          icon={<CopyOutlined />}
          onBlur={() => {
            setPopoverContent(popoverContentOpts.default)
          }}
          onClick={() => {
            copyContent().then(() =>
              setPopoverContent(popoverContentOpts.copied)
            )
          }}
        />
      </Popover>
    )
  }
)`
  font-size: 13px;
  margin-left: 5px;
`

export default CopyFileButton
