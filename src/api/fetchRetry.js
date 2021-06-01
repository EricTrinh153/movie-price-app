export function fetchRetry(url, options = {}, retries = 3, backoff = 1000) {
    /* 1 */
    return fetch(url, options)
      .then((res) => {
        console.log(res.body.toString());
        if (res.status === 200) return res;
        if (retries > 0 && res.status !== 200) {
          setTimeout(() => {
            /* 2 */
            return fetchRetry(
              url,
              options,
              retries - 1,
              backoff * 2
            ); /* 3 */
          }, backoff); /* 2 */
        } else {
          throw new Error(res);
        }
      })
      .catch(console.error);

  }
