import axios from 'axios'
import useSWR, { SWRResponse } from 'swr'

export function useStates(countryCode?: string): SWRResponse<any, Error> {
  return useSWR(
    `${process.env.REACT_APP_API_ENDPOINT}/api/countries/${countryCode}/states`,
    (url): any => {
      if (!countryCode) {
        return {} as SWRResponse<any, Error>
      }

      return axios(url)
    }
  )
}
