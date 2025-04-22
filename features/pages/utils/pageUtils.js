async function handlePageTransition(context, currentPage, triggerAction, timeout = 10000) {
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout }).catch(() => null),
      triggerAction()
    ]);
    return newPage || currentPage;
  }
  
  module.exports = { handlePageTransition };