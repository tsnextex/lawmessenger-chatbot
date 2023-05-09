import { Message } from '@/types/chat';
import { OpenAIModel } from '@/types/openai';

import { AZURE_DEPLOYMENT_ID, OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '../app/const';

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';

export class OpenAIError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(message: string, type: string, param: string, code: string) {
    super(message);
    this.name = 'OpenAIError';
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

export const OpenAIStream = async (
  model: OpenAIModel,
  systemPrompt: string,
  temperature: number,
  key: string,
  messages: Message[],
) => {
  // console.log('systemPrompt.......', systemPrompt)
  // console.log('process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT.......', process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT)

  // replaced systemPrompt to system
  let system = process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT

  let url = `${OPENAI_API_HOST}/v1/chat/completions`;
  // if (OPENAI_API_TYPE === 'azure') {
  //   url = `${OPENAI_API_HOST}/openai/deployments/${AZURE_DEPLOYMENT_ID}/chat/completions?api-version=${OPENAI_API_VERSION}`;
  // }
  const prompt_array = messages.slice(Math.max(messages.length - 12, 1));

  if (model.id == 'chatsonic') {
    const prompt = messages.slice(-1)[0];

    const url = 'https://api.writesonic.com/v2/business/content/chatsonic?engine=premium';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': 'b2f6b6b8-4f44-4249-a34a-845328cd992b'
      },
      body: JSON.stringify({
        enable_google_results: 'true',
        enable_memory: false,
        input_text: prompt.content,
        stream: true,
      })
    };

    const res = fetch(url, options)
      .then(res => res.json())
      .then(json => {
        let response = json.message;
        // response = response.replace(/</g, '&lt;');
        // response = response.replace(/>/g, '&gt;');
        return response;
      })
      .catch(err => console.error('error:' + err));

    return res;

  } else {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(OPENAI_API_TYPE === 'openai' && {
          Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`
        }),
        ...(OPENAI_API_TYPE === 'azure' && {
          'api-key': `${key ? key : process.env.OPENAI_API_KEY}`
        }),
        ...((OPENAI_API_TYPE === 'openai' && OPENAI_ORGANIZATION) && {
          'OpenAI-Organization': OPENAI_ORGANIZATION,
        }),
      },
      method: 'POST',
      body: JSON.stringify({
        ...(OPENAI_API_TYPE === 'openai' && { model: model.id }),
        messages: [
          {
            role: 'system',
            content: system,
          },
          // ...messages,
          ...prompt_array
        ],
        max_tokens: 1000,
        temperature: temperature,
        stream: true,
      }),
    });
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    if (res.status !== 200) {
      const result = await res.json();
      if (result.error) {
        throw new OpenAIError(
          result.error.message,
          result.error.type,
          result.error.param,
          result.error.code,
        );
      } else {
        throw new Error(
          `OpenAI API returned an error: ${decoder.decode(result?.value) || result.statusText
          }`,
        );
      }
    }

    const stream = new ReadableStream({
      async start(controller) {
        const onParse = (event: ParsedEvent | ReconnectInterval) => {
          if (event.type === 'event') {
            const data = event.data;

            try {
              const json = JSON.parse(data);
              if (json.choices[0].finish_reason != null) {
                controller.close();
                return;
              }
              const text = json.choices[0].delta.content;
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            } catch (e) {
              controller.error(e);
            }
          }
        };

        const parser = createParser(onParse);

        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      },
    });

    // console.log(stream);
    return stream;
  }


};
